import { Controller, Post, Get, Body, Param, Request, Query, UseGuards, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AddPasswordDTO, User , UserCustomerDTO, UserDTO, UserMerchantDTO, UserRole } from '../users/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Import the guard
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserService } from '../users/user.service';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register') // Endpoint to register a new user
  async register(@Body() body: UserCustomerDTO) {
    let user ;
    if (body.user_type && body.user_type == UserRole.CUSTOMER ) {
      user = await this.authService.registerCustomer(body);
    }
  
    return user ;
  }


  @Post('partner-register') // Endpoint to register a new user (merchant)
  async register_(@Body() body: UserMerchantDTO) {
    let user ;
   
    if (body.user_type && body.user_type == UserRole.MERCHANT ) {
      user = await this.authService.registerMerchant(body);
    }
    return user ;
  }

  @Post('set-password/:id')// Define a POST endpoint for creating a new password
  async setPassword(@Param('id') id: number, @Body() body: AddPasswordDTO) {
    return this.authService.setPassword(id, body);
  }



  @Post('login') // Endpoint for users to log in and receive a token
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.logIn(body.email ,body.password) ;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile') // Endpoint for loged users to get his profile
  async getProfile(@Request() req: any) {
    return this.userService.findById(req.user.userId);
  }

  // Route pour confirmer l'email via le token fourni dans la requête
  @Get('confirm')
  async confirmEmail(@Query('token') token: string) {
      const user = await this.userService.validateToken(token); // Validation du token
      
      if (!user) {
          throw new NotFoundException('Token invalide ou expiré'); // Lancer une exception si le token est invalide ou expiré
      }

      // Marquer l'utilisateur comme vérifié si le token est valide
      await this.userService.confirmUser(user.id);
      
      return { message: 'Votre adresse email a été confirmée avec succès !' }; // Retourne un message de succès
  }
}

