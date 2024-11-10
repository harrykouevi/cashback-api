import { Injectable } from '@nestjs/common';
import { InjectPaypalClient } from 'nestjs-paypal-payouts';

@Injectable()
export class PaypalService {
    constructor(
        @InjectPaypalClient() private readonly paypalClient // Injection du client PayPal
    ) {}

    // Méthode pour créer un paiement PayPal
    async createPayment(amount: number): Promise<any> {
        const request = this.paypalClient.payment.create({
            intent: 'sale',// Type d'intention de paiement (vente) 
            payer: {
                payment_method: 'paypal', // Méthode de paiement utilisée (PayPal)
            },
            transactions: [{
                amount: {
                    total: amount.toString(),// Montant total du paiement
                    currency: 'USD',// Devise utilisée
                },
                description: 'Payment description',
            }],
            redirect_urls: {
                return_url: 'http://localhost:3000/success', // URL de redirection après le paiement réussi
                cancel_url: 'http://localhost:3000/cancel', // URL de redirection en cas d'annulation
            },
        });
        return request; // Retourne la requête de création de paiement
    }
}