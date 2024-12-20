import { Controller, Get, Post,Patch,Put, Delete, Param, Body, Query,  UseGuards , HttpStatus } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Import the guard
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { Category , CategoryDTO } from './category.entity';



@Controller('categories')
export class CategoriesController {

    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()// Endpoint to get all user  (e.g., GET /users)
    @UseGuards(JwtAuthGuard, RoleGuard ) //, RoleGuard  Appliquer les guards d'authentification et de rôle
    @Roles('admin','merchant','customer') // Spécifier que seul une categorie avec le rôle 'admin' peut accéder à cette route
    async getCategories() : Promise<any> {
        
        return {
            statusCode: HttpStatus.OK,
            data: await this.categoriesService.findAll(),
        };
    }

    @Get('search')// Endpoint to search a user (e.g., GET /users/search)
    @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin','merchant','customer') // Spécifier que seul une categorie avec le rôle 'merchant' peut accéder à cette route
    async searchCategories(@Query() params: object): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: await this.categoriesService.likeWithQueryBuilder(params) // Appel à la méthode du service pour effectuer la recherche
        };
    }

    
    // Endpoint to get a user by ID
    @Get(':id') // Route to get user by ID (e.g., GET /users/1)
    @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin','merchant','customer') // Spécifier que seul une categorie avec le rôle 'merchant' peut accéder à cette route
    async getCategoryById(@Param('id') id: number): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            // data: await  this.categoriesService.findById(id) // Call the service method to find the user
            data: await  this.categoriesService.getCategoryHierarchy(id) // Call the service method to find the user
        };
        
    }

    @Post() // Endpoint to create new user (admin exclusivelly)
    @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin') // Spécifier que seul une categorie avec le rôle 'merchant' peut accéder à cette route
    async createCategory(@Body() body: CategoryDTO) {
        return {
            statusCode: HttpStatus.OK,
            data: await  this.categoriesService.addCategory(body) // Appel à la méthode du service pour mettre à jour la categorie
        };
    }

    
    @Patch(':id') // Endpoint pour mettre à jour une categorie par ID
    @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin') // Spécifier que seul une categorie avec le rôle 'merchant' peut accéder à cette route
    async updateCategory(@Param('id') id: number, @Body() data:  CategoryDTO): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: await  this.categoriesService.updateCategory(id, data) // Appel à la méthode du service pour mettre à jour la categorie
        };
    }

 

    @Delete(':id') // Endpoint pour supprimer une categorie par ID
    @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin') // Spécifier que seul une categorie avec le rôle 'merchant' peut accéder à cette route
    async deleteCategory(@Param('id') id: number): Promise<void> {
        // Appel à la méthode du service pour supprimer la categorie
        return this.categoriesService.deleteCategory(id); 
    }

    @Get(':id/hierarchy')
    async getCategoryHierarchy(@Param('id') id: string): Promise<Category> {
        return this.categoriesService.getCategoryHierarchy(Number(id));
    }

}

