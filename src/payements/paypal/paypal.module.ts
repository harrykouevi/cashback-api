// src/paypal/paypal.module.ts

import { Module } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { PaypalController } from './paypal.controller';
import { NestjsPaypalPayoutsModule } from 'nestjs-paypal-payouts';
import { CashbackModule } from '../../cashback/cashback.module';
import { UserModule } from '../../users/user.module';
import { NotificationModule } from '../../notification/notification.module';

// Définition du module PayPal
@Module({
    imports: [
        // Enregistrement du module PayPal avec les informations d'authentification
        NestjsPaypalPayoutsModule.register({
            environment: process.env.PAYPAL_ENVIRONMENT as 'sandbox' | 'live', // Environnement (sandbox ou live)
            clientId: process.env.PAYPAL_CLIENT_ID, // ID client PayPal
            clientSecret: process.env.PAYPAL_CLIENT_SECRET, // Secret client PayPal
        }),
        CashbackModule,UserModule,NotificationModule 
    ],
    providers: [PaypalService], // Service utilisé pour gérer la logique de paiement
    controllers: [PaypalController], // Contrôleur pour gérer les requêtes HTTP
})
export class PaypalModule {}