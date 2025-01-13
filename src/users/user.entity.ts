import { IsNotEmpty , IsOptional , IsEnum , IsEmail, IsDate, IsDateString, Equals} from 'class-validator';
import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn ,OneToMany, JoinTable } from 'typeorm';
import { Permission } from './permission.entity';

export enum UserRole {
  CUSTOMER = 'customer',
  MERCHANT = 'merchant',
  ADMINISTRATEUR = 'admin',
}

export enum Booli {
  YES = 1,
  NO = 0,
}

@Entity({ name: 'users' })
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

  @Column({ 
    default: Booli.NO,
  })
  isActive: number;

  @Column({ nullable: true }) 
  validationToken?: string; // Token de validation (peut être nul)

  @Column({ default: false }) 
  isVerified?: boolean; // Indique si l'utilisateur a confirmé son email (false par défaut)

  @OneToMany(() => Permission , permission => permission.user,{
    // cascade: true, // Automatically save permission when saving the user
    // onDelete: 'SET NULL', // Ensure permissions are not deleted when user is deleted
  })
  permissions : Permission[];

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

//DTO class that defines the structure of data and includes validation rules for User creation.
export class AdminUserDTO {
  @IsNotEmpty() // Ensures the email field is not empty
  @IsEmail() // Validates that the input is a valid email addres
  email: string;

  @IsNotEmpty()
  @Exclude({ toPlainOnly: true }) // Exclude password when returning plain object
  password: string; // Store hashed passwords

  @IsNotEmpty() // Ensures the name field is not empty
  name: string;

  @IsNotEmpty() // Ensures the name field is not empty
  @IsEnum(UserRole)
  @Equals(UserRole['ADMINISTRATEUR'])
  user_type : UserRole ;

  @IsOptional()
  @IsDateString() // Ensures the date field is a date
  date_of_birth: Date;

  @IsOptional()
  phone_number: string;

  @IsOptional()
  address: string;
}

//DTO class that defines the structure of data and includes validation rules for User creation.
export class ActivationUserDTO {
  
  @IsNotEmpty() // Ensures the name field is not empty
  @IsEnum(Booli)
  isActive: number ;
}


//DTO class that defines the structure of data and includes validation rules for User creation.
export class UpdateUserDTO {
  @IsNotEmpty() // Ensures the email field is not empty
  @IsEmail() // Validates that the input is a valid email addres
  email: string;



  @IsNotEmpty() // Ensures the name field is not empty
  name: string;

  @IsNotEmpty()
  @IsDateString() // Ensures the date field is a date
  date_of_birth: Date;

  @IsOptional()
  phone_number: string;

  @IsOptional()
  address: string;
}