import { IsNotEmpty , IsOptional , IsEnum , IsEmail, IsDate,MinLength, IsDateString,IsBoolean, Equals} from 'class-validator';
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
  password: string; // Store hashed password

  @Column()
  name: string;

  @Column({ nullable: true })
  firstname: string;

  @Column({ unique: true })
  username: string;

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

  @Column({ nullable: true })
  merchantId: number;

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

export class AddPasswordDTO{
  @IsNotEmpty()
  @MinLength(6)
  @Exclude({ toPlainOnly: true }) // Exclude password when returning plain object
  password: string; // Store hashed passwords

  @IsNotEmpty()
  @MinLength(6)
  confirm_password: string;
}


//DTO class that defines the structure of data and includes validation rules for User creation.
export class UserDTO {

  @IsOptional()
  @IsBoolean()
  is_test: boolean = false;

  @IsNotEmpty() // Ensures the email field is not empty
  @IsEmail() // Validates that the input is a valid email addres
  email: string;

  @IsNotEmpty() // Ensures the username field is not empty
  username: string;

  @IsOptional() // Ensures the name field is not empty
  name: string;

  @IsOptional()
  firstname: string;

  @IsOptional()
  @Exclude({ toPlainOnly: true }) // Exclude password when returning plain object
  password: string; // Store hashed passwords


  @IsOptional()
  confirm_password: string;

  @IsOptional()
  cashback_account_balance: number;

  @IsNotEmpty() // Ensures the name field is not empty
  @IsEnum(UserRole)
  user_type : UserRole ;

  @IsOptional()
  @IsDateString() // Ensures the date field is a date
  date_of_birth: Date;

  @IsOptional()
  phone_number: string;

  @IsOptional()
  address: string;

  
  @IsOptional()
  merchantId: number;
  
}


//DTO class that defines the structure of data and includes validation rules for User creation.
export class UserCustomerDTO {

  @IsOptional()
  @IsBoolean()
  is_test: boolean = false;
  
  @IsNotEmpty() // Ensures the email field is not empty
  @IsEmail() // Validates that the input is a valid email addres
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @Exclude({ toPlainOnly: true }) // Exclude password when returning plain object
  password: string; // Store hashed passwords

  @IsNotEmpty()
  @MinLength(6)
  confirm_password: string;

  @IsNotEmpty() // Ensures the username field is not empty
  username: string;

  @IsNotEmpty() // Ensures the name field is not empty
  name: string;

  @IsOptional()
  firstname: string;

  @IsOptional()
  cashback_account_balance: number;

  @IsNotEmpty() // Ensures the name field is not empty
  @IsEnum(UserRole)
  @Equals(UserRole['CUSTOMER'])
  user_type : UserRole ;

  @IsOptional()
  @IsDateString() // Ensures the date field is a date
  date_of_birth: Date;

  @IsOptional()
  phone_number: string;

  @IsOptional()
  address: string;
  
}


export class UserMerchantDTO {
  @IsOptional()
  @IsBoolean()
  is_test: boolean = false;

  @IsNotEmpty() // Ensures the email field is not empty
  @IsEmail() // Validates that the input is a valid email addres
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @Exclude({ toPlainOnly: true }) // Exclude password when returning plain object
  password: string; // Store hashed passwords

  @IsNotEmpty()
  @MinLength(6)
  confirm_password: string;

  @IsNotEmpty() // Ensures the website_url field is not empty
  website_url: string;

  @IsNotEmpty() // Ensures the username field is not empty
  username: string;

  @IsNotEmpty() // Ensures the name field is not empty
  name: string;

  @IsOptional()
  firstname: string;

  @IsOptional()
  cashback_account_balance: number;

  @IsNotEmpty() // Ensures the name field is not empty
  @IsEnum(UserRole)
  @Equals(UserRole['MERCHANT'])
  user_type : UserRole ;

  @IsOptional()
  phone_number: string;

  @IsOptional()
  address: string;
  
}


//DTO class that defines the structure of data and includes validation rules for User creation.
export class AdminUserDTO {

  @IsOptional()
  @IsBoolean()
  is_test: boolean = false;
  
  @IsNotEmpty() // Ensures the email field is not empty
  @IsEmail() // Validates that the input is a valid email addres
  email: string;

  @IsNotEmpty() // Ensures the username field is not empty
  username: string;


  @IsNotEmpty() // Ensures the name field is not empty
  name: string;

  @IsNotEmpty() // Ensures the name field is not empty
  @IsEnum(UserRole)
  @Equals(UserRole['ADMINISTRATEUR'])
  user_type : UserRole ;

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
  
  @IsOptional()
  name: string;

  @IsOptional()
  firstname: string;

  @IsNotEmpty() // Ensures the username field is not empty
  username: string;

  @IsNotEmpty()
  @IsDateString() // Ensures the date field is a date
  date_of_birth: Date;

  @IsOptional()
  phone_number: string;

  @IsOptional()
  address: string;
}