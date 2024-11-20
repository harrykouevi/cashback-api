import { IsNotEmpty , IsOptional , IsEnum , IsEmail, IsDate, IsDateString, Equals} from 'class-validator';
import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;


  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
 
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

}



//DTO class that defines the structure of data and includes validation rules for User creation.
export class CategoryDTO {
  @IsNotEmpty() // Ensures the name field is not empty
  name: string;


  @IsOptional()
  description: string;
}