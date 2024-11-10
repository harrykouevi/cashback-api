import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { CashbackModule } from '../cashback/cashback.module';
import { NotificationModule } from '../notification/notification.module'; 


@Module({
  imports: [ CashbackModule , NotificationModule ],
  controllers: [WebhookController],
  providers: [WebhookService]
})
export class WebhookModule {}
