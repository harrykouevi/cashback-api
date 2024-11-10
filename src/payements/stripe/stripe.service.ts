import { Injectable, Inject } from '@nestjs/common';
import { Stripe } from 'stripe';

@Injectable()
export class StripeService {
    constructor(@Inject('STRIPE_CLIENT') private readonly stripeClient: Stripe) {}

    // Méthode pour créer un chargeur (charge) dans Stripe
    async createCharge(amount: number, currency = 'usd', source: string): Promise<Stripe.Charge> {
        return this.stripeClient.charges.create({
            amount,
            currency,
            source, // Source de paiement (token ou carte)
        });
    }
}