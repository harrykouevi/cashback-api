import { Controller, Post, Body,Headers,HttpCode } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CashbackService } from '../../cashback/cashback.service';
import { UserService } from '../../users/user.service';
import { NotificationService } from '../../notification/notification.service';
import { verifySignature } from '../payements.service';


@Controller('stripe')
export class StripeController {
    constructor(
        private readonly stripeService: StripeService,
        private readonly cashbackService : CashbackService,
        private readonly userService: UserService,
        private readonly notificationService : NotificationService,
    ) {}

    // Endpoint pour créer une charge dans Stripe
    @Post('create-charge')
    async createCharge(@Body() chargeDto: { amount: number; source: string }) {
        return this.stripeService.createCharge(chargeDto.amount, 'usd', chargeDto.source);// Appel du service pour créer une charge avec le montant et la source spécifiés
    }

    @Post('webhook')
    @HttpCode(200) // Respond with 200 OK
    async handleStripeWebhook(@Body() body: any, @Headers('X-Signature') signature: string): Promise<void> {
        // Log the received webhook event for debugging
        console.log('Received Stripe webhook:', body);

        // Verify the signature
        if (!verifySignature(body, signature)) {
            throw new Error('Invalid signature');
        }
        

        // Handle different event types
        switch (body.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = body.data.object; // Extract the payment intent object
                const transactionId = paymentIntent.id; // Get the transaction ID
                const amount = paymentIntent.amount_received; // Get the amount received
                const customerEmail = paymentIntent.charges.data[0].billing_details.email; // Extract customer's email

                console.log(`Payment succeeded for transaction ${transactionId} of amount ${amount}`);
                // Récupérer l'utilisateur par son email (ou par un autre moyen)
                const userId = await this.userService.getUserIdByEmail(customerEmail); // Implémentez cette méthode selon votre logique
                
                // Mettre à jour le compte de cashback
                //await this.cashbackService.handlePurchase(userId, transactionId, amount);
                await this.cashbackService.handlePurchase(body);

                
                break;

            case 'payment_intent.payment_failed':
                const failedPaymentIntent = body.data.object;
                console.log(`Payment failed for transaction ${failedPaymentIntent.id}`);
                await this.notificationService.sendPaymentFailureNotification(customerEmail, failedPaymentIntent.id);
                
                break;

            default:
                console.log(`Unhandled event type ${body.type}`);
                break;
        }
    }
}