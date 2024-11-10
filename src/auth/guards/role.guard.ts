import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector
    ) {}

    // Méthode qui détermine si l'accès à la route est autorisé en fonction du rôle de l'utilisateur
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        // Récupérer l'utilisateur attaché à la requête par le AuthGuard
        const user = request.user; 

        // Si aucun utilisateur n'est trouvé (non authentifié), renvoyer une erreur 401 (Unauthorized)
        if (!user) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        // Récupérer les rôles requis pour accéder à la route depuis les métadonnées
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        // Vérifier si les rôles requis existent et si le rôle de l'utilisateur est inclus dans ceux-ci
        return roles ? roles.includes(user.role) : false;
    }
}