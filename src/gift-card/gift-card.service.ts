import { Injectable ,Inject, NotFoundException , UnprocessableEntityException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository ,QueryFailedError } from 'typeorm';

import { GiftCard ,CreateGiftCardDto , UpdateGiftCardDto ,ActivationGiftCardDto } from './gift-card.entity';

@Injectable()
export class GiftCardService {
    constructor(
    @InjectRepository(GiftCard)
         private giftCardRepository: Repository<GiftCard>,
    ) {}

    async create(createGiftCardDto: CreateGiftCardDto) {
        const dto= {
            ...createGiftCardDto,
            code:  await  this.generateUniqueCode(), // Generate the unique code
        };
        console.log(dto)
        const giftCard = this.giftCardRepository.create(dto);
        console.log(giftCard)
        try {
            //save into database
            await this.giftCardRepository.save(giftCard);
        } catch (error) {
           
            // Check if the error is a QueryFailedError and contains a duplicate entry message
            if (error instanceof QueryFailedError && error.message.includes('duplicate key value violates unique constraint')) {
                throw new UnprocessableEntityException('Email or Categoryname already exists'); // Return friendly error message
            }
            throw new UnprocessableEntityException(error.message)
        }
        return giftCard;
    }

    async update(id: number, updateGiftCardDto: UpdateGiftCardDto): Promise<GiftCard> {
        const giftCard = await this.giftCardRepository.findOneBy({id});
    
        if (!giftCard) {
          throw new NotFoundException(`Gift card with ID ${id} not found`);
        }
    
        Object.assign(giftCard, updateGiftCardDto); // Merge the changes
    
        return this.giftCardRepository.save(giftCard);
    }
    

    async activate(id: number, actGiftCardDto: ActivationGiftCardDto): Promise<GiftCard> {
        const giftCard = await this.giftCardRepository.findOneBy({id});
    
        if (!giftCard) {
          throw new NotFoundException(`Gift card with ID ${id} not found`);
        }
    
        Object.assign(giftCard, actGiftCardDto); // Merge the changes
    
        return this.giftCardRepository.save(giftCard);
    }

    private async generateUniqueCode(): Promise<string> {
        let code: string;
        let isUnique = false;
        // Implement your unique code generation logic here
        // This is just a basic example, you might want to use a more robust solution
         while (!isUnique) {
            const timestamp = Date.now().toString(36); // Convert timestamp to base36 string
            const random = Math.random().toString(36).substring(2, 8); // Random string
       
            code = `GC-${timestamp}-${random}`.toUpperCase();
            // Check if a gift card with the generated code already exists in the database.
            const existingGiftCard = await this.giftCardRepository.findOne({ where: { code } });
             // If no gift card with the generated code exists, mark the code as unique.
            if (!existingGiftCard) {
              isUnique = true;
            }
        }
        return code; // Prefix + timestamp + random
    }
}
