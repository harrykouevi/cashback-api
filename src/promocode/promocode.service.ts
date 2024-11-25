import { Injectable , NotFoundException , UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,QueryFailedError } from 'typeorm';
import { Promocode , PromocodeDTO } from './promocode.entity';


@Injectable()
export class PromocodeService {

    constructor(
        @InjectRepository(Promocode)// Injection du repository pour l'entité Promocode
        private promocodeRepository: Repository<Promocode>,
    ) {}

    // Méthode pour trouver des codes promo  en fonction de deux paramètres
    async findByParams(param1?: string, param2?: string): Promise<Promocode[]> {
        // Objet pour stocker les paramètres de recherche
        const params = {}; 

        if (param1) params['param1'] = param1; // Ajout de param1 si fourni
        if (param2) params['param2'] = param2; // Ajout de param2 si fourni
        // Exécution de la recherche
        return this.promocodeRepository.find({ where: params }); 
    }


    // Méthode pour récupérer tous lese promocodes
    async findAll() : Promise<Promocode[]>{
        // Exécution de la recherche en utilisant le repository
        const promocodes =  await this.promocodeRepository.find();
        return promocodes; 
    }

    // Méthode pour trouver un code promo  par ID
    async findById(id: number): Promise<Promocode> {
        const promocode = await this.promocodeRepository.findOneBy({ id }); // Find Promocode by ID
        if (!promocode) {
            throw new NotFoundException(`Promocode with ID ${id} not found`); // Throw an error if not found
        }
        
        return promocode; // Return the found Promocode
    }

    // Méthode pour trouver des codes promo  avec QueryBuilder
    async findWithQueryBuilder(param: object): Promise<Promocode[]> {
        const query = this.promocodeRepository.createQueryBuilder('Promocode');
        
        Object.entries(param).forEach(([key, value]) => { 
            query.andWhere('promocode.'+key+' LIKE :value', { value : `%${value}%` });
        });
        // Recupère un tableau de codes promo  correspondants
        const promocodes =  await query.getMany(); 
        return promocodes; 
    }

    // Méthode pour ajouter un code promo 
    async addPromocode(data: PromocodeDTO) {

        const promocode = this.promocodeRepository.create(data);

        try {
            //save into database
            await this.promocodeRepository.save(promocode);
        } catch (error) {
            // Check if the error is a QueryFailedError and contains a duplicate entry message
            if (error instanceof QueryFailedError && error.message.includes('duplicate key value violates unique constraint')) {
                throw new UnprocessableEntityException('Promocode already exists'); // Return friendly error message
            }
            throw new UnprocessableEntityException(error.message)
        }
       
        return promocode;
    }


    // Méthode pour mettre à jour un code promo  par ID
    async updatePromocode(id: number, data: Partial<Promocode>): Promise<Promocode> {
        // Recherche la categorie par ID
        const promocode = await this.promocodeRepository.findOneBy({ id }); 

        if (!promocode) {
            // Lève une exception si la categorie n'existe pas
            throw new NotFoundException(`Promocode with ID ${id} not found`); 
        }
   

        Object.assign(promocode, data); // Met à jour les propriétés du promocode avec les nouvelles données
        // Sauvegarde les modifications dans la base de données
        return this.promocodeRepository.save(promocode); 
    }


    // Méthode pour supprimer un code promo  par ID
    async deletePromocode(id: number): Promise<void> {
        // Supprime la categorie par ID
        const result = await this.promocodeRepository.delete(id); 

        if (result.affected === 0) {
            // Lève une exception si la categorie n'existe pas
            throw new NotFoundException(`Promocode with ID ${id} not found`); 
        }
    }
}


