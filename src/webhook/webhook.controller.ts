import { Controller, Post, Body, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';
import { CashbackService } from '../cashback/cashback.service';
import { verifySignature } from '../payements/payements.service';
import { NotificationService } from '../notification/notification.service';



@Controller('webhook')
export class WebhookController {

    constructor(
        private readonly cashbackService : CashbackService,
        private readonly notificationService : NotificationService,

    ) {}
  
    private readonly secretKey = 'yourSecretKey'; // Your HMAC secret key

    @Post('paypal-webhook')
    @HttpCode(200) // Respond with 200 OK
    async handleWebhook(@Body() body: any, @Headers('X-Signature') signature: string): Promise<void> {
        // Log the received webhook event for debugging
        console.log('Received PayPal webhook:', body);

        // Verify the signature
        if (!verifySignature(body, signature)) {
            throw new Error('Invalid signature');
        }
        

        // Check the event type
        if (body.event_type === 'PAYMENT.SALE.COMPLETED') {
            const transactionId = body.resource.id; // Extract the transaction ID
            const amount = body.resource.amount.total; // Extract the amount
            const payerEmail = body.resource.payer.payer_info.email; // Extract payer's email

            console.log(`Payment completed for transaction ${transactionId} of amount ${amount}`);
            // Récupérer l'utilisateur par son email (ou par un autre moyen)
            const userId = await this.getUserIdByEmail(payerEmail); // Implémentez cette méthode selon votre logique
            
            // Mettre à jour le compte de cashback
            //await this.cashbackService.handlePurchase(userId, transactionId, amount);
            await this.cashbackService.handlePurchase(body);

        } else if (body.event_type === 'PAYMENT.SALE.FAILED') {
            const payerEmail = body.resource.payer.payer_info.email; // Extract payer's email
            // Traitement pour paiement échoué
            console.error(`Échec du paiement pour l'ID ${body.resource.id}`);
            // Mettre à jour le statut dans la base de données ou notifier l'utilisateur
            // Notifier le client concernant l'échec du paiement
            await this.notificationService.sendPaymentFailureNotification(payerEmail, body.resource.id);
        }
    }

    private async getUserIdByEmail(email: string): Promise<number> {
        // Implémentez la logique pour récupérer l'ID utilisateur par email
        return 1; // Remplacez par une recherche réelle dans votre base de données
    }

    @Post('notify-purchase')//payment notification
    @HttpCode(HttpStatus.OK)
    async notifyPurchase(@Body() body: any,@Headers('X-Signature') signature: string,) {
        // Verify the signature
        if (!verifySignature(body, signature)) {
            throw new Error('Invalid signature');
        }

        const { userId, transactionId, purchaseAmount } = body;
        // Process the purchase notification (you can call your cashback service here)
        //await this.cashbackService.handlePurchase(userId, transactionId, amount);
        await this.cashbackService.handlePurchase(body);

        return {
                statusCode: HttpStatus.OK,
                message: 'Purchase notification processed successfully',
                data: body,
        };
    }

   
}

