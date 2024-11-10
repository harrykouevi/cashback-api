import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { Stripe } from 'stripe';
import { CashbackModule } from '../../cashback/cashback.module';
import { UserModule } from '../../users/user.module';
import { NotificationModule } from '../../notification/notification.module';


@Module({
    imports:[CashbackModule,UserModule,NotificationModule],
    providers: [
        {
            provide: 'STRIPE_CLIENT',// Fournisseur pour le client Stripe
            useFactory: () => new Stripe('Mysecret', {
                //apiVersion: '2020-08-27', // Version de l'API Stripe utilisée
            }),
        },
        StripeService,
    ],
    controllers: [StripeController],
})
export class StripeModule {}
