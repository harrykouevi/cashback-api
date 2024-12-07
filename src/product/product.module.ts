import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { CategoriesModule } from '../categories/categories.module';
import { ProductController } from './product.controller';


@Module({
  imports:[TypeOrmModule.forFeature([Product]),
  CategoriesModule
  ],
  providers: [ProductService,],
  exports: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}

//TypeOrmModule.forFeature([Product]), CategoriesModule