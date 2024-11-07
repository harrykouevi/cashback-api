import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard'; // Import JWT guard

@Injectable()
export class MerchantGuard implements CanActivate {
  constructor(private readonly jwtAuthGuard: JwtAuthGuard) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // First check if the request is authenticated
    const isAuthenticated = await this.jwtAuthGuard.canActivate(context);
    
    if (!isAuthenticated) {
      return false;
    }

    // Check if the user role is merchant
    const user = request.user;
    return user.role === 'merchant'; // Only allow merchants
  }
}
