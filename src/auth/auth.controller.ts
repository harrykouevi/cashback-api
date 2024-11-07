import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User , UserDTO } from '../users/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register') // Endpoint to register a new user
  async register(@Body() body: UserDTO) {
    return this.authService.register(body);
  }


  @Post('login') // Endpoint for users to log in and receive a token
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateLogin(body.email, body.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.authService.login(user);
  }
}

