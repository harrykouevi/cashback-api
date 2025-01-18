import { DataSourceOptions } from 'typeorm';
import { DataSource } from 'typeorm';
import { User } from '../users/user.entity'; // Import your entities
import { Permission } from '../users/permission.entity';
import { Order } from '../order/order.entity';
import { Promocode } from '../promocode/promocode.entity';
import { Product } from '../product/product.entity';
// // import { OrderItem } from '../orderitem/orderitem.entity';
import { OrderItem } from '../order/orderitem.entity';
import { Category } from '../categories/category.entity';

export const dataSourceOptions: DataSourceOptions = {
    type: 'mysql', // or your database type (mysql, sqlite, etc.)
    host: 'localhost',
    port: 3306,
    username: 'tnhkyfvj_root',
    password: '#k7*eDbxvnEA2mB',
    database: 'tnhkyfvj_mqusutaa_cashback_dbd',
    migrations: [__dirname + '/../database/migrations/**/*{.js,.js}'],
    entities: [User,Permission,Order,OrderItem,Promocode,Product,Category],
    // migrations: ['dist/db/migrations/*.js'], // Path to compiled migration files
    synchronize: false, // Disable auto-sync in production
};

export const dataSource = new DataSource(dataSourceOptions);