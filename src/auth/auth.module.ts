import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Import the guard
import { Permission } from 'src/users/permission.entity';
import { NotificationService } from 'src/notification/notification.service';
import { MerchantModule } from '../merchant/merchant.module';
import { UserModule } from 'src/users/user.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([User,Permission]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'yourSecretKey', // Change this to a strong secret key
      signOptions: { expiresIn: '1h' },
    }),
    UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService,NotificationService], //,JwtAuthGuard
  exports: [AuthService], // Exporting JwtAuthGuard for use in other modules
})
export class AuthModule {}
