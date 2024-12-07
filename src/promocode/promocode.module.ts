import { Module } from '@nestjs/common';
import { PromocodeService } from './promocode.service';
import { PromocodeController } from './promocode.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promocode } from './promocode.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Promocode])],// AuthModule,
  providers: [PromocodeService],
  controllers: [PromocodeController],
  exports: [PromocodeService],
})
export class PromocodeModule {}
