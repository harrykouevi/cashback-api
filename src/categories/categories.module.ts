import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './category.entity';
import { BullModule } from '@nestjs/bull';
import Redis from 'ioredis';
import { CategoryUpdateQueueProcessor } from './categories-update-queue.processor';
import { NotificationService } from 'src/notification/notification.service';
import { ProductModule } from 'src/product/product.module';


@Module({
  imports:[TypeOrmModule.forFeature([Category]),
    BullModule.registerQueue({ name: 'category-update-queue' },{ name: 'error-queue' }),
    // BullModule.registerQueue),
  ],

  providers: [CategoriesService , CategoryUpdateQueueProcessor , NotificationService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
          return new Redis(); // Configurer Redis ici si nécessaire
      },
  },],
  controllers: [CategoriesController],
  exports: [CategoriesService], // Exporting the service to be used in other modules
})
export class CategoriesModule {}
