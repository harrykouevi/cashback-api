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


@Module({
  imports: [
    TypeOrmModule.forFeature([User,Permission]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'yourSecretKey', // Change this to a strong secret key
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService,NotificationService] //,JwtAuthGuard
  //exports: [JwtAuthGuard], // Exporting JwtAuthGuard for use in other modules
})
export class AuthModule {}
