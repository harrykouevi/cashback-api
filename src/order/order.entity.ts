import { IsNotEmpty , IsOptional , IsEnum , IsDateString, IsNumber} from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn,ManyToOne ,ManyToMany, Index,JoinTable , OneToMany ,JoinColumn } from 'typeorm';
import { Product } from '../product/product.entity';
// // import { OrderItem } from '../orderitem/orderitem.entity';
import { OrderItem } from '../order/orderitem.entity';
import { Promocode } from 'src/promocode/promocode.entity';

export enum Status {
  CANCELLED = 'CANCELLED',
  PROCESSING = 'PROCESSING',
  VALIDED = 'VALIDED',
  PAYED = 'PAYED',
  GOESDELIVERY = 'GOESDELIVERY',
}

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;


  @Column()
  orderdate: Date;

  @Column({ default: 0 })
  total_amount: number;

  // @Index() // Ajout de l'index ici
  // @Column({ nullable: true })
  // promocodeId: number;

  // @JoinColumn({ name: 'promocodeid', referencedColumnName: "id" }) // Personnalise le nom de la colonne dans la table Photo
  // @ManyToOne(() => Promocode, (promocode) => promocode.orders)
  // promocode: Promocode;

  @Column({ nullable: true })
  promocod: string;

  @Column({ default: 0 })
  discountpercentage: number;

  @Column({ default: 0 })
  definitive_amount: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PROCESSING,
  })
  status: Status ;


  // @ManyToMany(() => Product) //, order => order.products
  // @JoinTable({
  //   name: 'orderitems', // Nom de la table de jointure
  //   joinColumn: {
  //       name: 'orderId', // Nom de la colonne pour la commande
  //       referencedColumnName: 'id',
  //   },
  //   inverseJoinColumn: {
  //       name: 'productId', // Nom de la colonne pour le produit
  //       referencedColumnName: 'id',
  //   },
  // }) // Crée une table de jointure
  // products: Product[];

  @OneToMany(() => OrderItem , orderitem => orderitem.order,{
    cascade: true, // Automatically save orderitem when saving the user
    onDelete: 'CASCADE', // Ensure posts are deleted when order is deleted
  })
  orderitems : OrderItem[];


  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
 
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

}



//DTO class that defines the structure of data and includes validation rules for Order creation.
export class OrderDTO {
  @IsNotEmpty() // Ensures the email field is not empty
  userId: number;

  @IsNotEmpty()
  @IsDateString() // Ensures the date field is a date
  orderdate: Date;

  // @IsNotEmpty()
  // total_amount: number;
}

export class GetOrderDTO {

  @IsOptional()
  @IsDateString() // Ensures the date field is a date
  orderdate ?: Date;

  @IsOptional()
  userId ?: number;

  @IsOptional()
  @IsEnum(Status)
  status ?: Status ;
}

export class UpdateOrderDTO {

  @IsOptional()
  @IsDateString() // Ensures the date field is a date
  orderdate ?: Date;

  @IsOptional()
  userId ?: number;
}



//DTO class that defines the structure of data and includes validation rules for Order update status.
export class StatusOrderDTO {
  
  @IsNotEmpty() // Ensures the name field is not empty
  @IsEnum(Status)
  status: Status ;
}


