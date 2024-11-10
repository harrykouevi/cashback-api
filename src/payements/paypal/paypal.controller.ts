import { Controller, Post, Body , Headers,HttpCode} from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { CashbackService } from '../../cashback/cashback.service';
import { verifySignature } from '../payements.service';
import { UserService } from '../../users/user.service';



@Controller('paypal')
export class PaypalController {
    constructor(
        private readonly paypalService: PaypalService,
        private cashbackService: CashbackService,
        private readonly userService: UserService,
    ) {}

    

    // Endpoint pour créer un paiement PayPal
    @Post('create-payment')
    async createPayment(@Body('amount') amount: number) {
        return this.paypalService.createPayment(amount);
    }

    @Post('webhook')
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
            const userId = await this.userService.getUserIdByEmail(payerEmail); // Implémentez cette méthode selon votre logique
            
            // Mettre à jour le compte de cashback
            //await this.cashbackService.handlePurchase(userId, transactionId, amount);
            await this.cashbackService.handlePurchase(body);

        } else if (body.event_type === 'PAYMENT.SALE.FAILED') {
            // Traitement pour paiement échoué
            console.error(`Échec du paiement pour l'ID ${body.resource.id}`);
            // Mettre à jour le statut dans la base de données ou notifier l'utilisateur
        }
    }
   
}