import { IsNotEmpty , IsOptional , IsEnum , IsDateString} from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum Status {
  RUNNING = 'en traitement',
  VALIDED = 'validé',
  PAYED = 'payé',
  GOESDELIVERY = 'en cours de livraison',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userid: number;

  @Column()
  orderdate: Date;

  @Column({ default: 0 })
  total_amount: number;

  @Column({ nullable: true })
  promocodeid: number;

  @Column({ nullable: true })
  promocode: string;

  @Column({ default: 0 })
  discountpercentage: number;

  @Column({ default: 0 })
  definitive_amount: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.RUNNING,
  })
  status: Status ;


  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
 
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

}



//DTO class that defines the structure of data and includes validation rules for Order creation.
export class OrderDTO {
  @IsNotEmpty() // Ensures the email field is not empty
  userid: number;

  @IsNotEmpty()
  @IsDateString() // Ensures the date field is a date
  orderdate: Date;

  @IsNotEmpty()
  total_amount: number;
}

//DTO class that defines the structure of data and includes validation rules for Order update status.
export class StatusOrderDTO {
  
  @IsNotEmpty() // Ensures the name field is not empty
  @IsEnum(Status)
  status: Status ;
}


