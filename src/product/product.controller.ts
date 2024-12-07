import { Controller, Get, Post,Patch,Put, Delete, Param, Body, Query,  UseGuards , HttpStatus } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Import the guard
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { CreateProductDTO , UpdateProductDTO , StateProductDTO , GetProductDTO} from './product.entity';



@Controller('product')
export class ProductController {

    constructor(private readonly productService: ProductService) {}

    @Get()// Endpoint to get all Product in platforme (e.g., GET /products)
    @UseGuards(JwtAuthGuard, RoleGuard ) //, RoleGuard  Appliquer les guards d'authentification et de rôle
    @Roles('admin','merchant','customer') // Spécifier que seul un product avec le rôle 'admin' peut accéder à cette route
    async getProducts() : Promise<any> {
        
        return {
            statusCode: HttpStatus.OK,
            data: await this.productService.findAll(),
        };
    }

    @Get('search')// Endpoint to search a Product (e.g., GET /Products/search)
    @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin','merchant','customer') // Spécifier que seul un product avec le rôle 'merchant' peut accéder à cette route
    async searchProducts(@Query() params: GetProductDTO): Promise<any> {
        
        return {
            statusCode: HttpStatus.OK,
            data: await this.productService.likeWithQueryBuilder(params) // Appel à la méthode du service pour effectuer la recherche
        };
    }

    
    // Endpoint to get a Product by ID
    @Get(':id') // Route to get Product by ID (e.g., GET /Products/1)
    @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin','merchant') // Spécifier que seul un product avec le rôle 'merchant' peut accéder à cette route
    async getProductById(@Param('id') id: number): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: await  this.productService.findById(id) // Call the service method to find the Product
        };
        
    }

    @Post() // Endpoint to create new Product (admin exclusivelly)
    @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin') // Spécifier que seul un product avec le rôle 'merchant' peut accéder à cette route
    async createProduct(@Body() body: CreateProductDTO) {
        return {
            statusCode: HttpStatus.OK,
            data: await  this.productService.addProduct(body) // Appel à la méthode du service pour mettre à jour la categorie
        };
    }

    
    @Patch(':id') // Endpoint pour mettre à jour un product par ID
    @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin') // Spécifier que seul un product avec le rôle 'merchant' peut accéder à cette route
    async updateProduct(@Param('id') id: number, @Body() data:  UpdateProductDTO): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: await  this.productService.updateProduct(id, data) // Appel à la méthode du service pour mettre à jour la categorie
        };
    }

 

    @Delete(':id') // Endpoint pour supprimer un product par ID
    @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin') // Spécifier que seul un product avec le rôle 'merchant' peut accéder à cette route
    async deleteProduct(@Param('id') id: number): Promise<void> {
        // Appel à la méthode du service pour supprimer la categorie
        return this.productService.deleteProduct(id); 
    }

    @Patch(':id/activation')
    @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin') // Spécifier que seul un product avec le rôle 'merchant' peut accéder à cette route
    async activeProduct(@Param('id') id: number, @Body() body: StateProductDTO): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: await  this.productService.updateProduct(id, body) // Appel à la méthode du service pour mettre à jour l'utilisateur
        };
    }



    @Post() // Endpoint to create new Product (admin exclusivelly)
    @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('merchant') // Spécifier que seul un product avec le rôle 'merchant' peut accéder à cette route
    async sellProduct(@Body() body: CreateProductDTO) {
        return {
            statusCode: HttpStatus.OK,
            data: await  this.productService.addProduct(body) // Appel à la méthode du service pour mettre à jour la categorie
        };
    }
}

