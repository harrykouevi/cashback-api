import { Controller, Get, Post,Patch,Put, Delete, Param, Body, Query,  UseGuards , HttpStatus } from '@nestjs/common';
import { OrderService } from './order.service'; // Importation du service Panier

// Contrôleur pour gérer les requêtes liées au panier d'achats
@Controller('order')
export class OrderController {
    
    constructor(private readonly orderService: OrderService) {} // Injection du service Panier

    // Route pour ajouter un article au panier (POST /order/add)
    @Post('add')
    async addToOrder(@Body() body: { productId: number; quantity: number }) : Promise<any>{
        return {
            statusCode: HttpStatus.OK,
            data: await this.orderService.addToOrder(body.productId, body.quantity) // Appel à la méthode d'ajout au panier
        };
        // return this.orderService.addToOrder(body.productId, body.quantity); // Appel à la méthode d'ajout au panier
    }

    // Route pour retirer un article du panier (DELETE /order/remove/:productId)
    @Delete('remove/:productId')
    async removeFromOrder(@Param('productId') productId: number) : Promise<any>{
        return this.orderService.removeFromOrder(productId); // Appel à la méthode de retrait du panier
    }

    // Route pour obtenir le contenu actuel du panier (GET /order)
    @Get()
    async getOrder() : Promise<any>{
        return this.orderService.getOrder(); // Retourne le contenu actuel du panier
    }

    // Route pour effectuer un achat (POST /order/purchase)
    @Post('purchase')
    async purchase()  : Promise<any>{
        this.orderService.validatePurchase(); // Valide le contenu du panier avant l'achat
        const orderItems = this.orderService.getOrder(); // Récupère les articles dans le panier
        
        // Simuler l'achat (par exemple, réduire le stock)
        for (const item of orderItems) {
        console.log(`Achat de ${item.quantity} unités du produit ${item.productId}`); 
        // Logique pour réduire le stock peut être ajoutée ici
        }
        
        this.orderService.clearOrder(); // Vide le panier après l'achat réussi
        
        return { message: 'Achat réussi!', items: orderItems }; // Retourne un message de succès avec les articles achetés
    }
}