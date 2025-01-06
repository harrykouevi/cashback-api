import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ProductModule } from '../product/product.module';
import { Order } from './Order.entity';
import { OrderItems } from './orderitem.entity';
import { PromocodeModule } from 'src/promocode/promocode.module';
import { CategoriesModule } from 'src/categories/categories.module';


@Module({
  imports:[TypeOrmModule.forFeature([Order,OrderItems]),
    ProductModule , PromocodeModule , CategoriesModule,
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
