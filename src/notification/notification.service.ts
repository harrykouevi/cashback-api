// src/notification/notification.service.ts

import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class NotificationService {
    private transporter;

    constructor(private readonly mailerService: MailerService) {}

    async sendPaymentFailureNotification(email: string, paymentIntentId: string): Promise<void> {
        const mailOptions = {
            from: '"Your Company" <no-reply@yourcompany.com>', // Sender address
            to: email, // List of recipients
            subject: 'Action Required: Payment Failed', // Subject line
            text: `
                Bonjour,

                Nous avons rencontré un problème avec votre récente tentative de paiement. Cela peut être dû à une carte expirée ou à des fonds insuffisants.

                Pour éviter toute interruption de service, veuillez vérifier vos informations de paiement et réessayer. 

                ID de la transaction : ${paymentIntentId}

                Si vous avez besoin d'aide supplémentaire, n'hésitez pas à nous contacter.

                Merci pour votre attention !

                Cordialement,
                L'équipe de Votre Entreprise
            `,
            html: `
                <p>Bonjour,</p>
                <p>Nous avons rencontré un problème avec votre récente tentative de paiement. Cela peut être dû à une carte expirée ou à des fonds insuffisants.</p>
                <p>Pour éviter toute interruption de service, veuillez vérifier vos informations de paiement et réessayer.</p>
                <p>ID de la transaction : <strong>${paymentIntentId}</strong></p>
                <p>Si vous avez besoin d'aide supplémentaire, n'hésitez pas à nous contacter.</p>
                <p>Merci pour votre attention !</p>
                <p>Cordialement,<br>L'équipe de Votre Entreprise</p>
            `,
        };

        try {
            await this.mailerService.sendMail(mailOptions);
            console.log(`Notification sent to ${email}`);
        } catch (error) {
            console.error(`Failed to send notification to ${email}:`, error);
        }
    }
}