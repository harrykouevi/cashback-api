import { BadRequestException, HttpStatus, Injectable ,UnauthorizedException ,ForbiddenException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import { User, UserDTO, UserRole } from '../users/user.entity';
import { NotificationService } from 'src/notification/notification.service';



@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private readonly jwtService: JwtService,        
        private readonly notificationService: NotificationService,
        

    ) {}

  

    async register(body : Partial<UserDTO>): Promise<any>  {
       
        //check if email already exist
        const existingUser = await this.userService.findByEmail(body.email);
        if (existingUser) {
            throw new BadRequestException('email already exists');
        }
        
        let user = await this.userService.addUser(body)
        const validationToken  = await this.userService.addUserGeneratedToken(user);
        // Envoi d'un email de confirmation
        await this.notificationService.sendConfirmationLink(user, validationToken,body.is_test) ;
      
        return {
            statusCode: HttpStatus.OK,
            data:  user
        };
    }

    async logIn(email: string ,password:string): Promise<any> {

        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials....');
        }

        // Vérifiez si l'utilisateur a confirmé son email
        if (!user.isVerified && user.user_type  !== UserRole.ADMINISTRATEUR ) {
            // Envoyer un email de rappel pour confirmer l'adresse email
            // await this.notificationService.sendConfirmationLink(user, user.validationToken);
            throw new ForbiddenException('Veuillez confirmer votre adresse email avant de vous connecter');
        }

        const passcomparaison = await bcrypt.compare(password, user.password) ;
        if (!passcomparaison) {
            throw new UnauthorizedException();
        }
        
    
        const token = await this.generateAccessToken(user.id, user.user_type);
        return  { accessToken: token, role: user.user_type} ;
    }
    

    async generateAccessToken(userId: number, role: string) {
        const payload = { userId, role };
        return this.jwtService.signAsync(payload);
    }
}


