import { Controller, Get, Post,Patch,Put, Delete, Param, Body, Query,  UseGuards , HttpStatus, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Import the guard
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { User , UserDTO ,AdminUserDTO ,ActivationUserDTO ,UpdateUserDTO } from './user.entity';
import { AddPermissionDTO } from './permission.entity';



@Controller('users')
@UseGuards(JwtAuthGuard) 
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get()// Endpoint to get all user  (e.g., GET /users)
    @UseGuards(RoleGuard ) //, RoleGuard  Appliquer les guards d'authentification et de rôle
    @Roles('admin') // Spécifier que seul un utilisateur avec le rôle 'admin' peut accéder à cette route
    async getUsers() : Promise<any> {
        
        return {
            statusCode: HttpStatus.OK,
            data: await this.userService.findAll(),
        };
    }

    @Get('search')// Endpoint to search a user (e.g., GET /users/search)
    @UseGuards(RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin') // Spécifier que seul un utilisateur avec le rôle 'merchant' peut accéder à cette route
    async searchUsers(@Query() params: object): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: await this.userService.likeWithQueryBuilder(params) // Appel à la méthode du service pour effectuer la recherche
        };
    }

    
    // Endpoint to get a user by ID
    @Get(':id') // Route to get user by ID (e.g., GET /users/1)
    @UseGuards(RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin') // Spécifier que seul un utilisateur avec le rôle 'merchant' peut accéder à cette route
    async getUserById(@Param('id') id: number): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: await  this.userService.findOneWithPermissions(id) // Call the service method to find the user
        };
        
    }

    @Post() // Endpoint to create new user (admin exclusivelly)
    @UseGuards(RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin') // Spécifier que seul un utilisateur avec le rôle 'merchant' peut accéder à cette route
    async createUser(@Body() body: AdminUserDTO) {
        
        let user = await  this.userService.addUser(body) ;
        return {
            statusCode: HttpStatus.OK,
            data: user // Appel à la méthode du service pour mettre à jour l'utilisateur
        };
    }

    
    @Patch(':id') // Endpoint pour mettre à jour un utilisateur par ID
    @UseGuards(RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin') // Spécifier que seul un utilisateur avec le rôle 'merchant' peut accéder à cette route
    async updateUser(@Param('id') id: number, @Body() userData: UpdateUserDTO): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: await  this.userService.updateUser(id, userData) // Appel à la méthode du service pour mettre à jour l'utilisateur
        };
    }

    @Patch(':id/activation')
    @UseGuards(RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin')
    async activeUser(@Param('id') id: number, @Body() body: ActivationUserDTO): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: await  this.userService.updateUser(id, body) // Appel à la méthode du service pour mettre à jour l'utilisateur
        };
    }

    @UseGuards(RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin')
    @Put(':id/add-permissions')// Endpoint pour ajouter une permission à un utilisateur
    async assignPermission(@Param('id') id: number, @Body() body:AddPermissionDTO): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: await this.userService.assignPermissions_(id, body.permissions),
        };
    }


    @UseGuards(RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin')
    @Put(':id/remove-permissions')// Endpoint pour retirer une permission à un utilisateur
    async removePermission(@Param('id') id: number, @Body() body:AddPermissionDTO): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: await this.userService.removePermissions(id, body.permissions),
        };
    }

    @Delete(':id') // Endpoint pour supprimer un utilisateur par ID
    @HttpCode(HttpStatus.NO_CONTENT) // Sets the response status to 204
    @UseGuards(RoleGuard) // Appliquer les guards d'authentification et de rôle
    @Roles('admin') // Spécifier que seul un utilisateur avec le rôle 'merchant' peut accéder à cette route
    async deleteUser(@Param('id') id: number): Promise<void> {
        // Appel à la méthode du service pour supprimer l'utilisateur
        this.userService.deleteUser(id); 
    }

}
