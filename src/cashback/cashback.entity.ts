import { IsNotEmpty , IsOptional , IsEmail, IsDateString} from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';



@Entity()
export class Cashback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ default: 0 })
  cashback_account_balance: number;

  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
 
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;


}



//DTO class that defines the structure of data and includes validation rules for Cashback creation.
export class CashbackDTO {
  @IsNotEmpty() // Ensures the email field is not empty
  @IsEmail() // Validates that the input is a valid email addres
  email: string;

  @IsOptional()
  cashback_account_balance: number;


  @IsNotEmpty()
  @IsDateString() // Ensures the date field is a date
  date_of_birth: Date;


}

//DTO class that defines the structure of data and includes validation rules for Cashback creation.
export class AddCashbackDTO {
  @IsNotEmpty() // Ensures the email field is not empty
  @IsEmail() // Validates that the input is a valid email addres
  email: string;
  
  @IsNotEmpty()
  @IsDateString() // Ensures the date field is a date
  date_of_birth: Date;

  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  amount: number;
}

