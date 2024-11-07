import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { User , UserDTO } from './user.entity';



@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService) {}

    //@UseGuards(AuthGuard('jwt'))
    @Get()
    async getUsers() : Promise<Partial<User>[]> {
        return this.userService.findAll();
    }


    
    // Endpoint to get a user by ID
    @Get(':id') // Route to get user by ID (e.g., GET /users/1)
    async getUserById(@Param('id') id: number): Promise<Partial<User>> {
        return this.userService.findById(id); // Call the service method to find the user
    }
   

}
