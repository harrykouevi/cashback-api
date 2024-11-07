import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../users/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly usersService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            //secretOrKey: process.env.JWT_SECRET,
            secretOrKey: 'yourSecretKey', // Use the same secret as above

        });
    }

    async validate(payload: any) {
        return await this.usersService.findByEmail(payload.email);  // Return the merchant ID or any other relevant data

    }
}
