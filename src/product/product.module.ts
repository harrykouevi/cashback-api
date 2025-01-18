import { Module ,forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { CategoriesModule } from '../categories/categories.module';
import { ProductController } from './product.controller';
import { OrderModule } from 'src/order/order.module';


@Module({
  
  imports:[TypeOrmModule.forFeature([Product]),
  forwardRef(() => OrderModule), // Use forwardRef here
    CategoriesModule,
  ],
  providers: [ProductService,],
  exports: [ProductService , TypeOrmModule],
  controllers: [ProductController],
})
export class ProductModule {}

//TypeOrmModule.forFeature([Product]), CategoriesModule