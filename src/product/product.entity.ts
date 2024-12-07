import { IsNotEmpty , IsOptional , IsEnum , IsDateString,IsNumber,Min,Max,IsString,MaxLength} from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn ,ManyToOne, OneToMany,Index ,JoinColumn } from 'typeorm';
import { Category } from '../categories/category.entity';
import { OrderItems } from 'src/order/orderitem.entity';
// import { Merchant } from 'src/merchants/merchant.entity';

export enum BOOL {
    YES = 1,
    NO = 0,
  }


@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;
  
  @Column()
  categoryId: number;

  // @JoinColumn({ name: 'categoryId', referencedColumnName: "id" }) // Personnalise le nom de la colonne dans la table Photo
  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  // @Column()
  // merchantId: number;

  // @ManyToOne(() => Merchant, (merchant) => merchant.products)
  // merchant: Merchant;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @Column({
    type: 'enum',
    enum: BOOL,
    default: BOOL.NO,
  })
  isActivated: BOOL ;

  @OneToMany(() => OrderItems, orderItem => orderItem.product)
  orderitems: OrderItems[]; // Now holds references to OrderItems

 
}

//DTO class that defines the structure of data and includes validation rules for Product creation.
export class CreateProductDTO {

  @IsNotEmpty()
  @IsString({ message: 'name must be a string.' }) // Ensures the value is a string
  @MaxLength(9, { message: 'name must be less than 10 characters.' }) // Maximum length of 9 characters
  name: string;

  @IsOptional()
  @IsString({ message: 'description must be a string.' }) // Ensures the value is a string
  description: string;

  // @IsNotEmpty() 
  // @IsNumber()
  // merchantId: number;

  @IsNotEmpty() 
  @IsNumber()
  categoryId: number;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  stock: number;
}


//DTO class that defines the structure of data and includes validation rules for Product creation.
export class UpdateProductDTO {

  @IsOptional()
  @IsString({ message: 'name must be a string.' }) // Ensures the value is a string
  @MaxLength(9, { message: 'name must be less than 10 characters.' }) // Maximum length of 9 characters
  name: string;

  @IsOptional()
  @IsString({ message: 'description must be a string.' }) // Ensures the value is a string
  description: string;

  @IsOptional()
  @IsNumber()
  categoryId: number;

  // @IsOptional()
  // @IsNumber()
  // merchantId: number;

  @IsOptional()
  price: number;

  @IsOptional()
  @IsNumber()
  stock: number;

}

export class GetProductDTO {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString({ message: 'name must be a string.' }) // Ensures the value is a string
  name: string;

  @IsOptional()
  @IsString({ message: 'description must be a string.' }) // Ensures the value is a string
  description: string;

  @IsOptional()
  @IsNumber()
  categoryId: number;

  // @IsOptional()
  // @IsNumber()
  // merchantId: number;


}

//DTO class that defines the structure of data and includes validation rules for Product update status.
export class StateProductDTO {
  

  @IsNotEmpty() // Ensures the name field is not empty
  @IsEnum(BOOL)
  isActivated: BOOL ;
}


