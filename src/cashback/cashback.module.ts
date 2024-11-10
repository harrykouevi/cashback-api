import { Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashbackService } from './cashback.service';
import { Cashback } from './cashback.entity';
import { UserModule } from '../users/user.module';
// import { CashbackController } from './cashback.controller'; // Optional if you have user management features.
import { UserService } from '../users/user.service';




@Module({
  imports:[TypeOrmModule.forFeature([Cashback]),
  UserModule
 ],// AuthModule,
  // controllers:[CashbackController], // Optional if you have user management features.
  providers: [CashbackService,],
  exports: [CashbackService], // Exporting the service to be used in other modules
})
export class CashbackModule {}
