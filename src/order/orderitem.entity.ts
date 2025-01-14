import { Entity, PrimaryGeneratedColumn, ManyToOne, Column ,JoinColumn } from 'typeorm';
import { IsNotEmpty , IsOptional , IsNumber , IsDateString} from 'class-validator';
import { Order } from './order.entity';
import { Product } from '../product/product.entity';

@Entity({ name: 'orderitems' })
export class OrderItems {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    productId: number;

    @Column({ default: 0 })
    priceatorder: number;

    
    @ManyToOne(() => Order, order => order.orderitems)
    order: Order;

    @JoinColumn({ name: 'productId', referencedColumnName: "id" }) // Personnalise le nom de la colonne dans la table Photo
    @ManyToOne(() => Product, product => product.orderitems)
    product: Product;

    @Column()
    quantity: number; // Store quantity here

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
}

//DTO class that defines the structure of data and includes validation rules for Order creation.
export class AddProductToOrderDTO{
    
    @IsNotEmpty() 
    @IsNumber()
    productId: number;
  
    @IsNotEmpty()
    @IsNumber()
    quantity: number;
  }