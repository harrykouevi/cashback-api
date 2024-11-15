import { IsNotEmpty , IsOptional , IsEnum , IsEmail, IsDate, IsDateString} from 'class-validator';
import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  CUSTOMER = 'customer',
  MERCHANT = 'merchant',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Store hashed passwords

  @Column({ unique: true })
  name: string;

  @Column({ default: 0 })
  cashback_account_balance: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  user_type : UserRole ;

  @Column()
  date_of_birth: Date;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
 
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;


}

export class registerBody {
  email: string;
  password: string; // Store hashed passwords
  name: string;
  cashback_account_balance: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  user_type : UserRole ;
  date_of_birth: Date;
  phone_number: string;
  address: string;
}


//DTO class that defines the structure of data and includes validation rules for User creation.
export class UserDTO {
  @IsNotEmpty() // Ensures the email field is not empty
  @IsEmail() // Validates that the input is a valid email addres
  email: string;

  @IsNotEmpty()
  @Exclude({ toPlainOnly: true }) // Exclude password when returning plain object
  password: string; // Store hashed passwords

  @IsNotEmpty() // Ensures the name field is not empty
  name: string;

  @IsOptional()
  cashback_account_balance: number;

  @IsNotEmpty() // Ensures the name field is not empty
  @IsEnum(UserRole)
  user_type : UserRole ;

  @IsNotEmpty()
  @IsDateString() // Ensures the date field is a date
  date_of_birth: Date;

  @IsOptional()
  phone_number: string;

  @IsOptional()
  address: string;
}
