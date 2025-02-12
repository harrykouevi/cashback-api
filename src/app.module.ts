import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/type-orm.config';
import { BullModule } from '@nestjs/bull';
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
// import { EventSourcingModule } from 'event-sourcing-nestjs';
// import { RedisModule } from '@nestjs/redis'; // Importation du module Redis
import { PromocodeModule } from './promocode/promocode.module';
// import { RedisModule } from '@nestjs-modules/ioredis';
import { MerchantModule } from './merchant/merchant.module';
import { GiftCardModule } from './gift-card/gift-card.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the config globally available
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    // RedisModule.forRoot({
    //   type: 'single', // Type de connexion (single ou cluster)
    //   url: 'redis://localhost:6379', // URL de votre serveur Redis
    // }),
    // BullModule.forRoot({
    //   redis: {
    //     host: 'localhost',
    //     port: 6379,
    //   },
    // }),
    
    CqrsModule,
    AuthModule,
    UserModule,// Importing the UserModule here
    WebhookModule,
    CashbackModule,
    PaypalModule,// Importing the PaypalModule here
    StripeModule, NotificationModule, CategoriesModule, OrderModule,  PromocodeModule,// Importing the StripeModule here
    ProductModule, MerchantModule, GiftCardModule,

  ],
  controllers: [AppController],
  providers: [AppService
  ],
})
export class AppModule {}
