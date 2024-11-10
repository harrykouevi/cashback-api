import { BadRequestException, Injectable ,UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';



@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private readonly jwtService: JwtService
    ) {}

  

    async register(body : Partial<User>): Promise<Partial<User>>  {
        //check if email already exist
        const existingUser = await this.userService.findByEmail(body.email);
        if (existingUser) {
            throw new BadRequestException('email already exists');
        }
        // Méthode pour créer un nouvel utilisateur
        return this.userService.addUser(body); 
    }

    async singnIn(email: string ,password:string): Promise<any> {

        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const passcompaaison = await bcrypt.compare(password, user.password) ;
        if (!passcompaaison) {
            throw new UnauthorizedException();
        }
        console.log(user) ;

    
        const token = await this.generateAccessToken(user.id, user.user_type);
        return  { accessToken: token, role: user.user_type} ;
    }
    

    async generateAccessToken(userId: number, role: string) {
        const payload = { userId, role };
        return this.jwtService.signAsync(payload);
    }
}


