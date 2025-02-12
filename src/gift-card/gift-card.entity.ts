import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsNotEmpty, IsNumber, IsDate, IsOptional , IsDateString , IsBoolean, IsString, Min ,Max } from 'class-validator';


@Entity({ name: 'gift_cards' })
export class GiftCard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string;

  @Column()
  expirationDate: Date;

  @Column({ default: 0 })
  cashbackPercentage: number;

  @Column({ default: 0 })
  amount: number;

  @Column()
  code:  string;

  @Column({ name: 'is_active', default: true }) // Default to active
  isActive: boolean;

  @Column({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp',  name: 'updated_at', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

// create-gift-card.dto.ts

export class CreateGiftCardDto {
  @IsOptional()
  @IsString()
  imageUrl: string;

  @IsNotEmpty()
  @IsDateString()
  expirationDate: Date;

  @IsNotEmpty()
  @IsNumber()
  cashbackPercentage: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export class UpdateGiftCardDto {
    @IsOptional()
    @IsString()
    imageUrl?: string;
  
    @IsOptional()
    @IsDateString()
    expirationDate?: Date;
  
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    cashbackPercentage?: number;
  
    @IsOptional()
    @IsNumber()
    @Min(0) // Ensure amount is not negative
    amount?: number;


  }

  export class ActivationGiftCardDto {
    
    @IsNotEmpty()
    @IsBoolean()
    isActive?: boolean;
  }
