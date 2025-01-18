import { DataSource } from 'typeorm';
import { User } from '../users/user.entity'; // Import your entities

export const typeOrmConfig= new DataSource( {
    type: 'mysql', // or your database type (mysql, sqlite, etc.)
    port: 3306,
    username: 'root',
    password: '',
    database: 'cashback_dbd',
//   entities: [User, Transaction, Merchant, CashbackClaim, Payment],
//   entities: [User,Permission],
     migrations: ['database/migrations/**/*{.ts,.js}'],
    // migrations: ['dist/db/migrations/*.js'], // Path to compiled migration files
    synchronize: false, // Disable auto-sync in production
});