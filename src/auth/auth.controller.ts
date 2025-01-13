import { Controller, Post, Get, Body, Request, Query, UseGuards, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User , UserDTO } from '../users/user.entity';
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
  async register(@Body() body: UserDTO) {
    return this.authService.register(body);
  }


  @Post('login') // Endpoint for users to log in and receive a token
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.singnIn(body.email ,body.password) ;
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

