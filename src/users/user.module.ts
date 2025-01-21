import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller'; // Optional if you have user management features.
import { UserService } from './user.service'; // Optional if you have user management features.
import { User } from './user.entity';
import { AuthModule } from '../auth/auth.module';
import { Permission } from './permission.entity';
import { NotificationService } from '../notification/notification.service';
import { MerchantModule } from '../merchant/merchant.module';

@Module({
 imports:[TypeOrmModule.forFeature([Permission,User]) , MerchantModule ],
 controllers:[UserController], // Optional if you have user management features.
 providers:[UserService  , NotificationService ], // Optional if you have user management features.
 exports: [UserService ], // Exporting the service to be used in other modules
})

export class UserModule {}
