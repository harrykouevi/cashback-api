import { Controller, Get, Post,Patch,Put, Delete, Param, Body, Query,  UseGuards , HttpStatus } from '@nestjs/common';
import { PromocodeService } from './promocode.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Import the guard
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { GetPromocodeDTO , PromocodeDTO , StatePromocodeDTO, UpdatePromocodeDTO } from './promocode.entity';



@Controller('promocode')
export class PromocodeController {

    constructor(private readonly promocodeService: PromocodeService) {}

    @Get()// Endpoint to get all Promocode  (e.g., GET /Promocodes)
    @UseGuards(JwtAuthGuard, RoleGuard ) //, RoleGuard  Appliquer les guards d'authentification et de rôle
    @Roles('admin','merchant','customer') // Spécifier que seul un promocode avec le rôle 'admin' peut accéder à cette route
    async getPromocodes() : Promise<any> {
        
        return {
            statusCode: HttpStatus.OK,
            data: await this.promocodeService.findAll(),
        };
    }

    @Get('search')// Endpoint to search a Promocode (e.g., GET /Promocodes/search)
    @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin','merchant','customer') // Spécifier que seul un promocode avec le rôle 'merchant' peut accéder à cette route
    async searchPromocodes(@Query() params: GetPromocodeDTO): Promise<any> {
        
        return {
            statusCode: HttpStatus.OK,
            data: await this.promocodeService.likeWithQueryBuilder(params) // Appel à la méthode du service pour effectuer la recherche
        };
    }

    
    // Endpoint to get a Promocode by ID
    @Get(':id') // Route to get Promocode by ID (e.g., GET /Promocodes/1)
    @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin','merchant') // Spécifier que seul un promocode avec le rôle 'merchant' peut accéder à cette route
    async getPromocodeById(@Param('id') id: number): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: await  this.promocodeService.findById(id) // Call the service method to find the Promocode
        };
        
    }

    @Post() // Endpoint to create new Promocode (admin exclusivelly)
    @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin') // Spécifier que seul un promocode avec le rôle 'merchant' peut accéder à cette route
    async createPromocode(@Body() body: PromocodeDTO) {
        return {
            statusCode: HttpStatus.OK,
            data: await  this.promocodeService.addPromocode(body) // Appel à la méthode du service pour mettre à jour la categorie
        };
    }

    
    @Patch(':id') // Endpoint pour mettre à jour un promocode par ID
    @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin') // Spécifier que seul un promocode avec le rôle 'merchant' peut accéder à cette route
    async updatePromocode(@Param('id') id: number, @Body() data:  UpdatePromocodeDTO): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: await  this.promocodeService.updatePromocode(id, data) // Appel à la méthode du service pour mettre à jour la categorie
        };
    }

    
    @Patch(':id/activation')
    @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin') // Spécifier que seul un product avec le rôle 'merchant' peut accéder à cette route
    async activeProduct(@Param('id') id: number, @Body() body: StatePromocodeDTO): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: await  this.promocodeService.updatePromocode(id,body) // Appel à la méthode du service pour mettre à jour l'utilisateur
        };
    }

 

    @Delete(':id') // Endpoint pour supprimer un promocode par ID
    @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin') // Spécifier que seul un promocode avec le rôle 'merchant' peut accéder à cette route
    async deletePromocode(@Param('id') id: number): Promise<void> {
        // Appel à la méthode du service pour supprimer la categorie
        return this.promocodeService.deletePromocode(id); 
    }
}
