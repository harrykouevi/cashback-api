import { Injectable , NotFoundException , UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,QueryFailedError } from 'typeorm';
import { User , UserDTO } from './user.entity';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';



@Injectable()
export class UserService { 

    constructor(
        @InjectRepository(User)// Injection du repository pour l'entité User
        private usersRepository: Repository<User>,
    ) {}

    // Méthode pour trouver des utilisateurs en fonction de deux paramètres
    async findByParams(param1?: string, param2?: string): Promise<User[]> {
        // Objet pour stocker les paramètres de recherche
        const params = {}; 

        if (param1) params['param1'] = param1; // Ajout de param1 si fourni
        if (param2) params['param2'] = param2; // Ajout de param2 si fourni
        // Exécution de la recherche
        return this.usersRepository.find({ where: params }); 
    }


    // Méthode pour récupérer tous les utilisateurs
    async findAll() : Promise<UserDTO[]>{
        // Exécution de la recherche en utilisant le repository
        const users =  await this.usersRepository.find();
        return plainToInstance(UserDTO, users); // Transform entities to DTOs
    }


    // Méthode pour trouver des utilisateurs en fonction de l'email
    async findByEmail(email: string): Promise<User> {
    
        const params ={} ; // Objet pour stocker les paramètres de recherche
        // Ajout des paramètres à l'objet si ils sont fournis
        params['email'] = email ;
        // Exécution de la recherche en utilisant le repository
        return  await this.usersRepository.findOne({ where: params  });
    }

    // Méthode pour trouver des utilisateurs en fonction de l'email
    async getUserIdByEmail(email: string) {
        const user = await this.findByEmail(email);
        return  user.id;
    }

    // Méthode pour trouver un utilisateur par ID
    async findById(id: number): Promise<UserDTO> {
        const user = await this.usersRepository.findOneBy({ id }); // Find user by ID
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`); // Throw an error if not found
        }
        
        return plainToInstance(UserDTO, user); // Return the found user entity Transform  to DTOs
    }

    // Méthode pour trouver des utilisateurs avec QueryBuilder
    async findWithQueryBuilder(param: object): Promise<UserDTO[]> {
        const query = this.usersRepository.createQueryBuilder('user');
        
        Object.entries(param).forEach(([key, value]) => { 
            query.andWhere('user.'+key+' LIKE :value', { value : `%${value}%` });
        });
        // Recupère un tableau d'utilisateurs correspondants
        const users =  await query.getMany(); 
        return plainToInstance(UserDTO, users); // Transform entities to DTOs
    }

    // Méthode pour ajouter un utilisateur
    async updateCashbackBalance(userId,amount){
        try {
            await this.usersRepository.increment({ id: userId }, 'cashbackBalance', amount);
        } catch (error) {
            // Check if the error is a QueryFailedError and contains a duplicate entry message
            // if (error instanceof QueryFailedError && error.message.includes('duplicate key value violates unique constraint')) {
            //     throw new UnprocessableEntityException('Email or username already exists'); // Return friendly error message
            // }
            throw new UnprocessableEntityException(error.message)
        }

    }


    // Méthode pour ajouter un utilisateur
    async addUser(userData: Partial<User>) {
        
        //encrypt and update the received password
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword ;

        const user = this.usersRepository.create(userData);

        try {
            //save into database
            await this.usersRepository.save(user);
        } catch (error) {
            // Check if the error is a QueryFailedError and contains a duplicate entry message
            if (error instanceof QueryFailedError && error.message.includes('duplicate key value violates unique constraint')) {
                throw new UnprocessableEntityException('Email or username already exists'); // Return friendly error message
            }
            throw new UnprocessableEntityException(error.message)
        }
       
        return plainToInstance(UserDTO, user);
    }


    // Méthode pour mettre à jour un utilisateur par ID
    async updateUser(id: number, userData: Partial<User>): Promise<User> {
        // Recherche l'utilisateur par ID
        const user = await this.usersRepository.findOneBy({ id }); 

        if (!user) {
            // Lève une exception si l'utilisateur n'existe pas
            throw new NotFoundException(`User with ID ${id} not found`); 
        }

        Object.assign(user, userData); // Met à jour les propriétés de l'utilisateur avec les nouvelles données
        // Sauvegarde les modifications dans la base de données
        return this.usersRepository.save(user); 
    }


    // Méthode pour supprimer un utilisateur par ID
    async deleteUser(id: number): Promise<void> {
        // Supprime l'utilisateur par ID
        const result = await this.usersRepository.delete(id); 

        if (result.affected === 0) {
            // Lève une exception si l'utilisateur n'existe pas
            throw new NotFoundException(`User with ID ${id} not found`); 
        }
    }
}

