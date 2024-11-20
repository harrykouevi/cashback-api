import { Controller, Get, Post,Patch,Put, Delete, Param, Body, Query,  UseGuards , HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Import the guard
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { User , UserDTO ,AdminUserDTO ,ActivationUserDTO ,UpdateUserDTO } from './user.entity';



@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get()// Endpoint to get all user  (e.g., GET /users)
    @UseGuards(JwtAuthGuard, RoleGuard ) //, RoleGuard  Appliquer les guards d'authentification et de rôle
    @Roles('admin') // Spécifier que seul un utilisateur avec le rôle 'admin' peut accéder à cette route
    async getUsers() : Promise<any> {
        
        return {
            statusCode: HttpStatus.OK,
            data: await this.userService.findAll(),
        };
    }

    @Get('search')// Endpoint to search a user (e.g., GET /users/search)
    @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin') // Spécifier que seul un utilisateur avec le rôle 'merchant' peut accéder à cette route
    async searchUsers(@Query() params: object): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: await this.userService.findWithQueryBuilder(params) // Appel à la méthode du service pour effectuer la recherche
        };
    }

    
    // Endpoint to get a user by ID
    @Get(':id') // Route to get user by ID (e.g., GET /users/1)
    @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin') // Spécifier que seul un utilisateur avec le rôle 'merchant' peut accéder à cette route
    async getUserById(@Param('id') id: number): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: await  this.userService.findById(id) // Call the service method to find the user
        };
        
    }

    @Post() // Endpoint to create new user (admin exclusivelly)
    @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin') // Spécifier que seul un utilisateur avec le rôle 'merchant' peut accéder à cette route
    async createUser(@Body() body: AdminUserDTO) {
        return {
            statusCode: HttpStatus.OK,
            data: await  this.userService.addUser(body) // Appel à la méthode du service pour mettre à jour l'utilisateur
        };
    }

    
    @Patch(':id') // Endpoint pour mettre à jour un utilisateur par ID
    @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin') // Spécifier que seul un utilisateur avec le rôle 'merchant' peut accéder à cette route
    async updateUser(@Param('id') id: number, @Body() userData: UpdateUserDTO): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: await  this.userService.updateUser(id, userData) // Appel à la méthode du service pour mettre à jour l'utilisateur
        };
    }

    @Patch(':id/activation')
    @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin')
    async activeUser(@Param('id') id: number, @Body() body: ActivationUserDTO): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: await  this.userService.updateUser(id, body) // Appel à la méthode du service pour mettre à jour l'utilisateur
        };
    }

    @Delete(':id') // Endpoint pour supprimer un utilisateur par ID
    @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin') // Spécifier que seul un utilisateur avec le rôle 'merchant' peut accéder à cette route
    async deleteUser(@Param('id') id: number): Promise<void> {
        // Appel à la méthode du service pour supprimer l'utilisateur
        return this.userService.deleteUser(id); 
    }

}
