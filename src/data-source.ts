import { DataSource } from 'typeorm';
import { User } from './users/user.entity'; // Import your entities
import { Permission } from './users/permission.entity';
// import { Transaction } from './src/transaction/transaction.entity';
// import { Merchant } from './src/merchant/merchant.entity';
// import { CashbackClaim } from './src/cashback-claim/cashback-claim.entity';
// import { Payment } from './src/payment/payment.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host:  'localhost',
  port: +process.env.DB_PORT,
  username: 'root',
  password: '',
  database: 'cashback_dbd',
//   entities: [User, Transaction, Merchant, CashbackClaim, Payment],
  entities: [User,Permission],
  migrations: [__dirname + '/database/migrations/**/*{.ts,.js}'],
  synchronize: true, // Set to false in production
});