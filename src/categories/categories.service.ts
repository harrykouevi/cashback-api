import { Injectable ,Inject, NotFoundException , UnprocessableEntityException } from '@nestjs/common';
import { Queue } from 'bull'; // Importer Queue ici
import { InjectQueue } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,QueryFailedError } from 'typeorm';
import { Category , CategoryDTO } from './category.entity';
import { Product } from '../product/product.entity';
// import { ProductSoldEvent } from '../tools/events/product-sold.event';
import Redis from 'ioredis'; // Importation de la bibliothèque ioredis pour interagir avec Redis



@Injectable()
export class CategoriesService {

    constructor(
        @InjectRepository(Category)// Injection du repository pour l'entité Category
        private categoryRepository: Repository<Category>,
        @Inject('REDIS_CLIENT') 
        private readonly redisClient: Redis, // Injection du client Redis configuré dans le module
        @InjectQueue('category-update-queue') 
        private categoryUpdateQueue: Queue,
    ) {}

    // Méthode pour trouver dese categories en fonction de deux paramètres
    async findByParams(param1?: string, param2?: string): Promise<Category[]> {
        // Objet pour stocker les paramètres de recherche
        const params = {}; 
        if (param1) params['param1'] = param1; // Ajout de param1 si fourni
        if (param2) params['param2'] = param2; // Ajout de param2 si fourni
        // Exécution de la recherche
        return this.categoryRepository.find({ where: params }); 
    }


    // Méthode pour récupérer tous lese categories
    async findAll() : Promise<Category[]>{
        // Exécution de la recherche en utilisant le repository
        const categories =  await this.categoryRepository.find();
        return categories; 
    }

    // Méthode pour trouver une categorie par ID
    async findById(id: number): Promise<Category> {
        const category = await this.categoryRepository.findOneBy({ id }); // Find Category by ID
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`); // Throw an error if not found
        }
        return category; // Return the found Category
    }

    

    // Méthode pour trouver dese categories avec QueryBuilder
    async likeWithQueryBuilder(param: object): Promise<Category[]> {
        const query = this.categoryRepository.createQueryBuilder('Category');
        Object.entries(param).forEach(([key, value]) => { 
            query.andWhere('category.'+key+' LIKE :value', { value : `%${value}%` });
        });
        // Recupère un tableau da categories correspondants
        const categories =  await query.getMany(); 
        return categories; 
    }

    // Méthode pour ajouter une categorie
    async addCategory(CategoryData: CategoryDTO) {
        const category = this.categoryRepository.create(CategoryData);
        try {
            //save into database
            await this.categoryRepository.save(category);
        } catch (error) {
            // Check if the error is a QueryFailedError and contains a duplicate entry message
            if (error instanceof QueryFailedError && error.message.includes('duplicate key value violates unique constraint')) {
                throw new UnprocessableEntityException('Email or Categoryname already exists'); // Return friendly error message
            }
            throw new UnprocessableEntityException(error.message)
        }
        return category;
    }


    // Méthode pour mettre à jour une categorie par ID
    async updateCategory(id: number, CategoryData: Partial<Category>): Promise<Category> {
        // Recherche la categorie par ID
        const category = await this.categoryRepository.findOneBy({ id }); 
        if (!category) {
            // Lève une exception si la categorie n'existe pas
            throw new NotFoundException(`Category with ID ${id} not found`); 
        }
        // Met à jour les propriétés de la categorie avec les nouvelles données
        Object.assign(category, CategoryData); 
        //mise en file d'attente pour des traitements suplémentaires
        // await this.categoryUpdateQueue.add(category);
        // Sauvegarde les modifications dans la base de données
        return this.categoryRepository.save(category); 
    }


    // Méthode pour supprimer une categorie par ID
    async deleteCategory(id: number): Promise<void> {
        // Supprime la categorie par ID
        const result = await this.categoryRepository.delete(id); 
        if (result.affected === 0) {
            // Lève une exception si la categorie n'existe pas
            throw new NotFoundException(`Category with ID ${id} not found`); 
        }
    }

    // Méthode pour récupérer tous les categories et leur hierarchie complète
    async getCategoryHierarchy(id: number): Promise<Category> {
        this.redisClient.del(`category_hierarchy_${id}`);

        // Définition d'une clé unique pour le cache basée sur l'ID de la catégorie
        const cacheKey = `category_hierarchy_${id}`; 
        // Vérifier si les données sont déjà présentes dans le cache Redis
        const cachedResult = await this.redisClient.get(cacheKey);
        if (cachedResult) {
            return JSON.parse(cachedResult); // Si les données sont en cache, les retourner après les avoir analysées en JSON
        }
        // Si les données ne sont pas en cache, récupérer la catégorie depuis la base de données
        const category = await this.categoryRepository.findOne({
          where: { id: id },
          relations: ['parentCategory','subCategories'], // Charger les sous-catégories
        });
        
        if (category) {
            // Mettre en cache le résultat dans Redis avec une expiration d'une heure (3600 secondes)
            await this.redisClient.set(cacheKey, JSON.stringify(category), 'EX', 3600);
        }
        return category;
    }

    // Méthode pour mettre à jour les attribut de statistique de categorie
    async statisticUpdating(product:Product) {
        // Invalidation du cache descategories pour garantir que les données soient à jour lors des prochaines requêtes
        this.redisClient.del(`category_hierarchy_${product.category.id}`);
        let currentCategory = product.category;
        currentCategory.totalSold += product.price; // Ajouter le prix du produit au total vendu

        //mise en file d'attente pour des traitements suplémentaires
        await this.categoryUpdateQueue.add(product,{
            attempts: 5, // Nombre maximum de tentatives
            backoff: 5000 // Délai de 5 secondes entre chaque tentative
          });

        return await this.categoryRepository.save(currentCategory); // Sauvegarder les changements
    }

    // async handleProductSold(event: ProductSoldEvent): Promise<void> {
    //     const product = await this.productService.findWithCategories(event.productId);

    //     if (product && product.category) {
    //         let currentCategory = product.category;
    //         while (currentCategory) {
    //             currentCategory.totalSold += event.price; // Mettre à jour le total vendu
    //             await this.categoryRepository.save(currentCategory); // Sauvegarder les changements
    //             currentCategory = currentCategory.parentCategory; // Passer à la catégorie parente pour continuer la mise à jour des totaux vendus
    //         }
    //         this.redisClient.del(`category_hierarchy_${product.category.id}`); // Invalidation du cache après une vente pour garantir que les données soient à jour lors des prochaines requêtes
    //     }
    // }


    
}

