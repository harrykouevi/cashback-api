import { IsNotEmpty , IsOptional , IsEnum , IsUrl,IsNumber,IsEmail,IsString,MaxLength} from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn ,ManyToOne, OneToMany,Index ,JoinColumn } from 'typeorm';

@Entity({ name: 'merchants' })
export class Merchant {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  website_url: string;

  @Column()
  address: string;
}

//DTO class that defines the structure of data and includes validation rules for Merchant creation.
export class CreateMerchantDTO {

    @IsNotEmpty()
    @IsString({ message: 'name must be a string.' }) // Ensures the value is a string
    @MaxLength(29, { message: 'name must be less than 29 characters.' }) // Maximum length of 9 characters
    name: string;
  
    @IsNotEmpty() // Ensures the email field is not empty
    @IsEmail() // Validates that the input is a valid email addres
    email: string;
  
    @IsNotEmpty() 
    @IsUrl()
    website_url: string;
  
  
    @IsOptional()
    address: string;
}