// src/notification/notification.service.ts

import { Injectable } from '@nestjs/common';
import { AppSource } from 'src/data-source';
import { MailerService } from '@nestjs-modules/mailer';
import { User, UserDTO } from 'src/users/user.entity';

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

    async sendConfirmationLink(user: UserDTO, token: string , is_test:boolean) : Promise<void> {
       
        const email = is_test ? 'harry.kouevi@gmail.com' : user.email ;
        const url = `${AppSource.domain_url}/auth/confirm?token=${token}`;
        const mailOptions = {
                from:  `"${AppSource.company}" <no-reply@yourcompany.com> `, // Adresse de l'expéditeur
                to: email  , // Adresse email du destinataire
                subject: 'Veuillez Valider Votre Inscription', // Ligne de sujet
                text: `
                    Bonjour,
            
                    Merci de vous être inscrit sur notre plateforme ! 
            
                    Pour finaliser votre inscription, veuillez cliquer sur le lien ci-dessous pour valider votre adresse email :
            
                    [${url}]

                    Si le lien ne fonctionne pas, vous pouvez également le copier et le coller dans la barre d'adresse de votre navigateur.
            
                    Si vous n'avez pas créé de compte, ignorez simplement cet email.
            
                    Merci et à bientôt !
            
                    Cordialement,
                    L'équipe de Votre Entreprise
                `,
                html: `
                    <p>Bonjour,</p>
                    <p>Merci de vous être inscrit sur notre plateforme !</p>
                    <p>Pour finaliser votre inscription, veuillez cliquer sur le lien ci-dessous pour valider votre adresse email :</p>
                    <p><a href="${url}" style="color: #4CAF50; text-decoration: none; font-weight: bold;">Valider mon adresse email</a> </p>
                    <p>ou copier ceci ${url} Si le lien ne fonctionne pas, vous pouvez également le copier et le coller dans la barre d'adresse de votre navigateur.</p>
                    <p>Si vous n'avez pas créé de compte, ignorez simplement cet email.</p>
                    <p>Merci et à bientôt !</p>
                    <p>Cordialement,<br>L'équipe de Votre Entreprise</p>
                `,
            };

        try {
            await this.mailerService.sendMail(mailOptions);
            console.log(`Notification sent to ${email }`);
        } catch (error) {
            console.error(`Failed to send notification to ${email }:`, error);
        }
    }
    sendErrorNotification(message: string) {
        // Ici, vous pouvez intégrer un service d'envoi d'e-mails ou autre
        console.log(`Notification: ${message}`);
    }
}