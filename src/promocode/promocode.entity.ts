import { IsNotEmpty , IsOptional , IsEnum , IsDateString,IsNumber,Min,Max,IsString,MaxLength} from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn,OneToMany } from 'typeorm';
import { IsEndDateGreaterThanStartDate } from 'src/tools/validation/is-end-date-greater-than-start-date.decorator';
import { Order } from 'src/order/Order.entity';

export enum BOOL {
  YES = 1,
  NO = 0,
}

export const allowedAttributesForSearch = ['isActive']; // Define allowed attributes
        

@Entity({ name: 'promocodes' })
export class Promocode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  enddate: Date;

  @Column()
  startdate: Date;

  @Column()
  discountpercentage: number;


  @Column({
    type: 'enum',
    enum: BOOL,
    default: BOOL.NO,
  })
  isActive: BOOL ;

  @OneToMany(() => Order, (order) => order.promocode)
  orders: Order[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
 
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

}

export class GetPromocodeDTO {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  isActive?: BOOL;
}



//DTO class that defines the structure of data and includes validation rules for Promocode creation.
export class PromocodeDTO {

  @IsNotEmpty()
  @IsString({ message: 'Code must be a string.' }) // Ensures the value is a string
  @MaxLength(9, { message: 'Code must be less than 10 characters.' }) // Maximum length of 9 characters
  code: string;

  @IsNotEmpty()
  @IsDateString()
  startdate: Date;

  @IsNotEmpty()
  @IsDateString()
  @IsEndDateGreaterThanStartDate('startdate', { message: 'End date must be greater than start date!' })
  enddate: Date;


  @IsNumber() // Ensures the value is a number
  @Min(0, { message: 'Percentage must be at least 0%' }) // Minimum value
  @Max(100, { message: 'Percentage cannot exceed 100%' }) // Maximum value
  discountpercentage: number;

  @IsOptional()
  isActive: number;

}


//DTO class that defines the structure of data and includes validation rules for Promocode creation.
export class UpdatePromocodeDTO {

  @IsOptional()
  @IsString({ message: 'Code must be a string.' }) // Ensures the value is a string
  @MaxLength(9, { message: 'Code must be less than 10 characters.' }) // Maximum length of 9 characters
  code: string;

  @IsOptional()
  @IsDateString()
  startdate: Date;

  @IsOptional()
  @IsDateString()
  @IsEndDateGreaterThanStartDate('startdate', { message: 'End date must be greater than start date!' })
  enddate: Date;

  @IsOptional()
  @IsNumber() // Ensures the value is a number
  @Min(0, { message: 'Percentage must be at least 0%' }) // Minimum value
  @Max(100, { message: 'Percentage cannot exceed 100%' }) // Maximum value
  discountpercentage: number;

  @IsOptional()
  isActive: BOOL ;

}

//DTO class that defines the structure of data and includes validation rules for Promocode update status.
export class StatePromocodeDTO {
  
  @IsNotEmpty() // Ensures the name field is not empty
  @IsEnum(BOOL)
  isActive: BOOL ;
}


