import { Controller, Get, Post,Patch,Put, Delete, Param, Body, Query,  UseGuards , HttpStatus } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Import the guard
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { CreateMerchantDTO , UpdateMerchantDTO , StateMerchantDTO , GetMerchantDTO} from './merchant.entity';



@Controller('product')
export class MerchantController {

    constructor(private readonly merchantService: MerchantService) {}

    @Get()// Endpoint to get all Merchant in platforme (e.g., GET /products)
    @UseGuards(JwtAuthGuard, RoleGuard ) //, RoleGuard  Appliquer les guards d'authentification et de rôle
    @Roles('admin','merchant','customer') // Spécifier que seul un product avec le rôle 'admin' peut accéder à cette route
    async getMerchants() : Promise<any> {
        
        return {
            statusCode: HttpStatus.OK,
            data: await this.merchantService.findAll(),
        };
    }

    @Get('search')// Endpoint to search a Merchant (e.g., GET /Merchants/search)
    @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin','merchant','customer') // Spécifier que seul un product avec le rôle 'merchant' peut accéder à cette route
    async searchMerchants(@Query() params: GetMerchantDTO): Promise<any> {
        
        return {
            statusCode: HttpStatus.OK,
            data: await this.merchantService.likeWithQueryBuilder(params) // Appel à la méthode du service pour effectuer la recherche
        };
    }

    
    // Endpoint to get a Merchant by ID
    @Get(':id') // Route to get Merchant by ID (e.g., GET /Merchants/1)
    @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin','merchant') // Spécifier que seul un product avec le rôle 'merchant' peut accéder à cette route
    async getMerchantById(@Param('id') id: number): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: await  this.merchantService.findById(id) // Call the service method to find the Merchant
        };
        
    }

    @Post() // Endpoint to create new Merchant (admin exclusivelly)
    @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin') // Spécifier que seul un product avec le rôle 'merchant' peut accéder à cette route
    async createMerchant(@Body() body: CreateMerchantDTO) {
        return {
            statusCode: HttpStatus.OK,
            data: await  this.merchantService.add(body) // Appel à la méthode du service pour mettre à jour la categorie
        };
    }

    
    @Patch(':id') // Endpoint pour mettre à jour un product par ID
    @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin') // Spécifier que seul un product avec le rôle 'merchant' peut accéder à cette route
    async updateMerchant(@Param('id') id: number, @Body() data:  UpdateMerchantDTO): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: await  this.merchantService.update(id, data) // Appel à la méthode du service pour mettre à jour la categorie
        };
    }

 

    @Delete(':id') // Endpoint pour supprimer un product par ID
    @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin') // Spécifier que seul un product avec le rôle 'merchant' peut accéder à cette route
    async deleteMerchant(@Param('id') id: number): Promise<void> {
        // Appel à la méthode du service pour supprimer la categorie
        return this.merchantService.delete(id); 
    }


    @Post() // Endpoint to create new Merchant (admin exclusivelly)
    @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('merchant') // Spécifier que seul un product avec le rôle 'merchant' peut accéder à cette route
    async sellMerchant(@Body() body: CreateMerchantDTO) {
        return {
            statusCode: HttpStatus.OK,
            data: await  this.merchantService.add(body) // Appel à la méthode du service pour mettre à jour la categorie
        };
    }
}

