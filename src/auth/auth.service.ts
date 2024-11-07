import { Injectable } from '@nestjs/common';
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
        const hashedPassword = await bcrypt.hash(body.password, 10);
        body.password = hashedPassword ;
        // Méthode pour créer un nouvel utilisateur
        return this.userService.addUser(body); 
    }

    async validateLogin(email: string, password: string): Promise<Partial<User>> {

        const user = await this.userService.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    

    async login(user: Partial<User>) {
        const payload = { email: user.email };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }


    async generateAccessToken2(merchantId: number) {
        const payload = { merchantId };
        return this.jwtService.sign(payload);
    }

    
    async generateAccessToken(userId: number, role: string) {
        const payload = { userId, role };
        return this.jwtService.sign(payload);
    }
}


