import { forwardRef, Inject, Injectable , NotFoundException , UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMerchantDTO, Merchant } from './merchant.entity';
import { Repository,QueryFailedError } from 'typeorm';

@Injectable()
export class MerchantService {
   
    constructor(
        @InjectRepository(Merchant)
        private  merchantRepository: Repository<Merchant>
    ) {}

    // Méthode pour ajouter un partenaire 
    async add(data: CreateMerchantDTO) {
        const merchant = this.merchantRepository.create(data);
       
        try {
            //save into database
            await this.merchantRepository.save(merchant);
        } catch (error) {
            // Check if the error is a QueryFailedError and contains a duplicate entry message
            if (error instanceof QueryFailedError && error.message.includes('duplicate key value violates unique constraint')) {
                throw new UnprocessableEntityException('Merchant already exists'); // Return friendly error message
            }
            throw new UnprocessableEntityException(error.message)
        }
        
        return merchant;
    }
}
