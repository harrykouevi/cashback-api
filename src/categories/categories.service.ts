import { Injectable , NotFoundException , UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,QueryFailedError } from 'typeorm';
import { Category , CategoryDTO } from './Category.entity';
import { plainToInstance } from 'class-transformer';




@Injectable()
export class CategoriesService {

    constructor(
        @InjectRepository(Category)// Injection du repository pour l'entité Category
        private categoryRepository: Repository<Category>,
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
    async findWithQueryBuilder(param: object): Promise<Category[]> {
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
   

        Object.assign(category, CategoryData); // Met à jour les propriétés de la categorie avec les nouvelles données
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
}

