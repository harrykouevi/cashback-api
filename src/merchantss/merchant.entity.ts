import { IsNotEmpty , IsOptional , IsEnum , IsUrl,IsNumber,IsEmail,IsString,MaxLength} from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn ,ManyToOne, OneToMany,Index ,JoinColumn } from 'typeorm';


export enum BOOL {
    YES = 1,
    NO = 0,
  }


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


//DTO class that defines the structure of data and includes validation rules for Merchant creation.
export class UpdateMerchantDTO {

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

export class GetMerchantDTO {
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

//DTO class that defines the structure of data and includes validation rules for Merchant update status.
export class StateMerchantDTO {
  

  @IsNotEmpty() // Ensures the name field is not empty
  @IsEnum(BOOL)
  isActivated: BOOL ;
}


