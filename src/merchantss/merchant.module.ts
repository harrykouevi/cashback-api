import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantService } from './merchant.service';
import { Merchant } from './merchant.entity';
import { MerchantController } from './merchant.controller';


@Module({
    imports:[TypeOrmModule.forFeature([Merchant]),  ],
    providers: [MerchantService,],
    controllers: [MerchantController],
    exports: [MerchantService ],
})
export class MerchantModule {}
