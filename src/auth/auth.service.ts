import { BadRequestException, HttpStatus, Injectable ,UnauthorizedException ,ForbiddenException, UnprocessableEntityException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import { AddPasswordDTO, User, UserDTO, UserMerchantDTO, UserRole } from '../users/user.entity';
import { NotificationService } from 'src/notification/notification.service';



@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private readonly jwtService: JwtService,        
        private readonly notificationService: NotificationService,
        

    ) {}

  

    private async register(body : Partial<UserDTO>): Promise<any>  {
       
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

    async registerCustomer(body : Partial<UserDTO>): Promise<any>  { 
        return this.register(body) ;
    }

    async registerMerchant(body : UserMerchantDTO): Promise<any>  { 
        return this.register(body) ;
    }

    async logIn(email: string ,password:string): Promise<any> {
         // Find the user by their email address
        const user = await this.userService.findByEmail(email);
        // If the user does not exist, return a 404 error
        if (!user) {
            throw new Error('Invalid credentials....');
        }

        // Vérifiez si l'utilisateur a confirmé son email
        if (!user.isVerified && user.user_type  !== UserRole.ADMINISTRATEUR ) {
            // Envoyer un email de rappel pour confirmer l'adresse email
            // await this.notificationService.sendConfirmationLink(user, user.validationToken);
            throw new ForbiddenException('Veuillez confirmer votre adresse email avant de vous connecter');
        }

        // If the user exists but does not have a password set, prompt them to create one
        if (!user.password) {
             throw new ForbiddenException('Password not set. Please create a password.');
        }

        const passcomparaison = await bcrypt.compare(password, user.password) ;
        if (!passcomparaison) {
            throw new UnauthorizedException();
        }
        
    
        const token = await this.generateAccessToken(user.id, user.user_type);
        return  { accessToken: token, role: user.user_type} ;
    }
    
    async setPassword(userId: number, body : AddPasswordDTO): Promise<UserDTO> // Define a POST endpoint for creating a new password
    {
        
        if (body.password || body.confirm_password) {
            if (body.password !== body.confirm_password) {
                throw new UnprocessableEntityException('The passwords do not match.');
            }
        }
        
        return  await this.userService.addPassword( userId ,body.password); // Hachage du mot de passe
    }
      

    async generateAccessToken(userId: number, role: string) {
        const payload = { userId, role };
        return this.jwtService.signAsync(payload);
    }
}


