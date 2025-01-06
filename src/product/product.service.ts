import { forwardRef, Inject, Injectable , NotFoundException , UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,QueryFailedError } from 'typeorm';
import { Product  , CreateProductDTO} from './product.entity';
import { CategoriesService } from '../categories/categories.service';

import Redis from 'ioredis'; // Importation de la bibliothèque ioredis pour interagir avec Redis
import { Category } from 'src/categories/category.entity';


// Service pour gérer les produits disponibles
@Injectable()
export class ProductService {

  constructor(
      @InjectRepository(Product)// Injection du repository pour l'entité Product
      private  productRepository: Repository<Product>,
      @Inject(forwardRef  (() => CategoriesService))
      private readonly  categoryService: CategoriesService,
  ) {}

  // Simule une base de données de produits
  private products = [
    { id: 1, name: 'Produit A', stock: 10 },
    { id: 2, name: 'Produit B', stock: 0 }, // Produit en rupture de stock
    { id: 3, name: 'Produit C', stock: 5 },
  ];

  // Méthode pour trouver des codes promo  en fonction de deux paramètres
  async findByParams(param1?: string, param2?: string): Promise<Product[]> {
      // Objet pour stocker les paramètres de recherche
      const params = {}; 

      if (param1) params['param1'] = param1; // Ajout de param1 si fourni
      if (param2) params['param2'] = param2; // Ajout de param2 si fourni
      // Exécution de la recherche
      return this.productRepository.find({ where: params }); 
  }


  // Méthode pour récupérer tous lese products
  async findAll() : Promise<Product[]>{
      // Exécution de la recherche en utilisant le repository
      const products =  await this.productRepository.find();
      return products; 
  }

  // Méthode pour trouver un produit  par ID
  async findById(id: number): Promise<Product> {
      const product = await this.productRepository.findOneBy({ id }); // Find Product by ID
      if (!product) {
          throw new NotFoundException(`Product with ID ${id} not found`); // Throw an error if not found
      }
      
      return product; // Return the found Product
  }

 

  // Méthode pour trouver des codes promo  avec QueryBuilder
  async likeWithQueryBuilder(param: object): Promise<Product[]> {
      const query = this.productRepository.createQueryBuilder('Product');
      
      Object.entries(param).forEach(([key, value]) => { 
          query.andWhere('product.'+key+' LIKE :value', { value : `%${value}%` });
      });
      // Recupère un tableau de codes promo  correspondants
      const products =  await query.getMany(); 
      return products; 
  }
  

  // Méthode pour trouver des codes promo  avec QueryBuilder
  async findWithCategories(productId: number): Promise<any> {
      
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['category'], // Charger la catégorie du produit
    });

    if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`); // Throw an error if not found
    }
  
    return product; 
  }

  // Méthode pour ajouter un produit 
  async addProduct(data: CreateProductDTO) {
   
    
    // Vérifiez si le produit existe dans la base de données
    const category: Category = await this.categoryService.findById(data.categoryId);
   
    const product = this.productRepository.create(data);

    try {
        //save into database
        await this.productRepository.save(product);
    } catch (error) {
        // Check if the error is a QueryFailedError and contains a duplicate entry message
        if (error instanceof QueryFailedError && error.message.includes('duplicate key value violates unique constraint')) {
            throw new UnprocessableEntityException('Product already exists'); // Return friendly error message
        }
        throw new UnprocessableEntityException(error.message)
    }
   
    return product;
}


// Méthode pour mettre à jour un produit  par ID
async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
  // Recherche la categorie par ID
  const product = await this.productRepository.findOneBy({ id }); 

  if (!product) {
      // Lève une exception si la categorie n'existe pas
      throw new NotFoundException(`Product with ID ${id} not found`); 
  }

  Object.assign(product, data); // Met à jour les propriétés du product avec les nouvelles données
  // Sauvegarde les modifications dans la base de données
  return this.productRepository.save(product); 
}


// Méthode pour supprimer un produit  par ID
async deleteProduct(id: number): Promise<void> {
    // Supprime la categorie par ID
    const result = await this.productRepository.delete(id); 

    if (result.affected === 0) {
        // Lève une exception si la categorie n'existe pas
        throw new NotFoundException(`Product with ID ${id} not found`); 
    }
}

async sellProduct(productId: number): Promise<any> {
  const product = await this.findWithCategories( productId );

  if (!product) {
    throw new Error('Product not found');
  }
  //création d'une commande validée

  //création du paiement ou transations

  //définir la commande comme payé

  // Mettre à jour le total vendu de la catégorie
  await this.categoryService.statisticUpdating(product); 
  return product;
}


  //  async handleProductSold(event: ProductSoldEvent): Promise<void> {
  //   const product = await this.findWithCategories(event.productId);

  //   if (product && product.category) {
  //     await this.categoryService.statisticUpdating(product); 
  //   }
  // }

}