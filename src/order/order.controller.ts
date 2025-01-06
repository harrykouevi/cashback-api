import { Controller, Get, Post,Patch,Put, Delete, Param, Body, Query,  UseGuards , HttpStatus, HttpCode } from '@nestjs/common';
import { OrderService } from './order.service'; // Importation du service Commande
import { AddProductToOrderDTO } from './orderitem.entity';
import { GetOrderDTO, Order , OrderDTO, UpdateOrderDTO } from './Order.entity';
import { Roles } from '../auth/guards/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Import the guard
import { RoleGuard } from '../auth/guards/role.guard';


// Contrôleur pour gérer les requêtes liées à la commande d'achats
@Controller('order')
export class OrderController {
    
    constructor(private readonly orderService: OrderService) {} // Injection du service Commande

   
    // Route recuperer les commandes (GET /order)
    @Get()// Endpoint to get all Order in platforme (e.g., GET /products)
    async getOrder() : Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: await this.orderService.findAll(),
        };
    }

    @Get('search')// Endpoint to search a order (e.g., GET /order/search)
    @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin') // Spécifier que seul un utilisateur avec le rôle 'merchant' peut accéder à cette route
    async search(@Query() params: GetOrderDTO): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: await this.orderService.likeWithQueryBuilder(params) // Appel à la méthode du service pour effectuer la recherche
        };
    }
  
    // Endpoint to get a Order by ID
    @Get(':id') // Route to get Order by ID (e.g., GET /Orders/1)
    async getOrderById(@Param('id') id: number): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: await  this.orderService.findOneWithItems(id) // Call the service method to find the Order
        };
    }

    
    @Post() // Endpoint to create new Order (admin exclusivelly)
    @HttpCode(HttpStatus.CREATED)
    async createOrder(@Body() body: OrderDTO) {
        return {
            statusCode: HttpStatus.CREATED,
            data: await  this.orderService.addOrder(body) // Appel à la méthode du service pour mettre à jour la categorie
        };
    }

    
    @Patch(':id') // Endpoint pour mettre à jour une commande par ID
    async updateOrder(@Param('id') id: number, @Body() data:  UpdateOrderDTO): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: await  this.orderService.updateOrder(id, data) // Appel à la méthode du service pour mettre à jour la categorie
        };
    }

 
    @Patch(':id/promocode-application') // Utiliser PATCH pour annuler la commande
    async applyPromotion(@Param('id') id: number, @Body() items: any): Promise<any> {
        console.log(items) ;
        return {
            statusCode: HttpStatus.OK,
            items:  await this.orderService.applyPromotionToOrder(id,items.code),
        }
    }

    @Patch(':id/cancel') // Utiliser PATCH pour annuler la commande
    async cancelOrder(@Param('id') id: number): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data:  await this.orderService.cancelOrder(id),
        }
    }


    @Patch(':id/checkout') // Utiliser PATCH pour annuler la commande
    async checkoutOrder(@Param('id') id: number): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data:  await this.orderService.checkoutOrder(id),
        }
    }


    // Route pour ajouter un produit à la commande (Put /order/addproducts)
    @Put(':id/addproducts')
    async addToOrder(@Param('id') id: number, @Body() data:  AddProductToOrderDTO) : Promise<any>{
        return {
            statusCode: HttpStatus.OK,
            data: await this.orderService.addProductToOrder(id, data) // Appel à la méthode d'ajout à la commande
        };
    }


    // Route pour retirer un produit de la commande (DELETE /order/remove/:productId)
    @Put(':orderId/products/:productId')
    async removeOrder(@Param('orderId') orderId: number, @Param('productId') productId: number): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: await this.orderService.removeProductFromOrder(orderId, productId)
        };
    }

    
}