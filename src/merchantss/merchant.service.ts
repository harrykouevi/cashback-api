import { forwardRef, Inject, Injectable , NotFoundException , UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,QueryFailedError } from 'typeorm';
import { Merchant  , CreateMerchantDTO} from './merchant.entity';



// Service pour gérer les partenaires disponibles
@Injectable()
export class MerchantService{

  constructor(
      @InjectRepository(Merchant)// Injection du repository pour l'entité Merchant
      private  merchantRepository: Repository<Merchant>,
  ) {}

  // Simule une base de données de partenaires
  private merchants = [
    { id: 1, name: 'Produit A', stock: 10 },
    { id: 2, name: 'Produit B', stock: 0 }, // Produit en rupture de stock
    { id: 3, name: 'Produit C', stock: 5 },
  ];

  // Méthode pour trouver des codes promo  en fonction de deux paramètres
  async findByParams(param1?: string, param2?: string): Promise<Merchant[]> {
      // Objet pour stocker les paramètres de recherche
      const params = {}; 

      if (param1) params['param1'] = param1; // Ajout de param1 si fourni
      if (param2) params['param2'] = param2; // Ajout de param2 si fourni
      // Exécution de la recherche
      return this.merchantRepository.find({ where: params }); 
  }


  // Méthode pour récupérer tous lese merchants
  async findAll() : Promise<Merchant[]>{
      // Exécution de la recherche en utilisant le repository
      const merchants =  await this.merchantRepository.find();
      return merchants; 
  }

  // Méthode pour trouver un partenaire  par ID
  async findById(id: number): Promise<Merchant> {
      const merchant = await this.merchantRepository.findOneBy({ id }); // Find Merchant by ID
      if (!merchant) {
          throw new NotFoundException(`Merchant with ID ${id} not found`); // Throw an error if not found
      }
      
      return merchant; // Return the found Merchant
  }

 

  // Méthode pour trouver des codes promo  avec QueryBuilder
  async likeWithQueryBuilder(param: object): Promise<Merchant[]> {
      const query = this.merchantRepository.createQueryBuilder('Merchant');
      
      Object.entries(param).forEach(([key, value]) => { 
          query.andWhere('merchant.'+key+' LIKE :value', { value : `%${value}%` });
      });
      // Recupère un tableau de codes promo  correspondants
      const merchants =  await query.getMany(); 
      return merchants; 
  }
  

  // Méthode pour trouver des codes promo  avec QueryBuilder
  async findWithCategories(merchantId: number): Promise<any> {
      
    const merchant = await this.merchantRepository.findOne({
      where: { id: merchantId },
      relations: ['category'], // Charger la catégorie du partenaire
    });

    if (!merchant) {
        throw new NotFoundException(`Merchant with ID ${merchantId} not found`); // Throw an error if not found
    }
  
    return merchant; 
  }

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


  // Méthode pour mettre à jour un partenaire  par ID
  async update(id: number, data: Partial<Merchant>): Promise<Merchant> {
    // Recherche la categorie par ID
    const merchant = await this.merchantRepository.findOneBy({ id }); 

    if (!merchant) {
        // Lève une exception si la categorie n'existe pas
        throw new NotFoundException(`Merchant with ID ${id} not found`); 
    }

    Object.assign(merchant, data); // Met à jour les propriétés du merchant avec les nouvelles données
    // Sauvegarde les modifications dans la base de données
    return this.merchantRepository.save(merchant); 
  }


  // Méthode pour supprimer un partenaire  par ID
  async delete(id: number): Promise<void> {
      // Supprime la categorie par ID
      const result = await this.merchantRepository.delete(id); 

      if (result.affected === 0) {
          // Lève une exception si la categorie n'existe pas
          throw new NotFoundException(`Merchant with ID ${id} not found`); 
      }
  }

}