import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { WebhookModule } from './webhook/webhook.module';
import { CashbackModule } from './cashback/cashback.module';
import { StripeModule } from './payements/stripe/stripe.module';
import { PaypalModule } from './payements/paypal/paypal.module';
import { NotificationModule } from './notification/notification.module';
import { CategoriesModule } from './categories/categories.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { PromocodeModule } from './promocode/promocode.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the config globally available
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      // username: process.env.DB_USER,
      // password: process.env.DB_PASS,
      // database: process.env.DB_NAME,
      //
      username: 'root',
      password: '',
      database: 'cashback_db',
      //
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    UserModule,// Importing the UserModule here
    WebhookModule,
    CashbackModule,
    PaypalModule,// Importing the PaypalModule here
    StripeModule, NotificationModule, CategoriesModule, OrderModule, ProductModule, PromocodeModule,// Importing the StripeModule here

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
