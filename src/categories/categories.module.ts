import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './Category.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Category])],// AuthModule,
  providers: [CategoriesService],
  controllers: [CategoriesController],
  exports: [CategoriesService], // Exporting the service to be used in other modules
})
export class CategoriesModule {}
