import { Module } from '@nestjs/common';
import { GiftCardService } from './gift-card.service';
import { GiftCardController } from './gift-card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiftCard } from './gift-card.entity';

@Module({
   imports:[TypeOrmModule.forFeature([GiftCard])
        
    ],
  providers: [GiftCardService],
  controllers: [GiftCardController]
})
export class GiftCardModule {}
