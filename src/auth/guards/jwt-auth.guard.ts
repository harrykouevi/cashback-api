import { Injectable, CanActivate, ExecutionContext,UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';


@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
    ) {}

    // Méthode qui détermine si l'accès à la route est autorisé
    async canActivate(context: ExecutionContext): Promise<boolean> {
        //request intercepted
        const request = context.switchToHttp().getRequest();
         // Récupération du token JWT depuis l'en-tête Authorization
        const token = this.extractTokenFromHeader(request);

        // Si aucun token n'est présent, renvoie une erreur 401 (Unauthorized)
        if (!token) {
          throw new UnauthorizedException();
        }

        try {
           // Vérification du token et décodage des informations de l'utilisateur
          request.user = await this.jwtService.verifyAsync( token,{secret: jwtConstants.secret}); // Attacher l'utilisateur à la requête
          return true ; // Accès autorisé
        } catch (error) {
            // Si le token est invalide ou expiré, renvoyer une erreur 401 (Unauthorized)
            throw new UnauthorizedException();
        }
       
    }

    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
}

export const jwtConstants = {
  secret: 'yourSecretKey',
};
