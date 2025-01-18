import { Injectable , NotFoundException , UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository ,InjectConnection } from '@nestjs/typeorm';
import { Repository,QueryFailedError , Connection } from 'typeorm';
import { User , UserDTO, UserRole } from './user.entity';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { Permission, rolePermissions } from './permission.entity';
import { NotificationService } from '../notification/notification.service';
import { randomBytes } from 'crypto';

// import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService { 

    constructor(
        // @InjectConnection() private readonly connection: Connection ,
        @InjectRepository(User)// Injection du repository pour l'entité User
        private usersRepository: Repository<User>,

        @InjectRepository(Permission)// Injection du repository pour l'entité User
        private permissionRepository: Repository<Permission>,

        private readonly notificationService: NotificationService,
        
    ) {}

     // Méthode pour générer un token aléatoire
    private generateToken(): string {
        return randomBytes(32).toString('hex');
       // Génère un token aléatoire de 32 octets en hexadécimal
    }

     // Méthode pour sauvegarder le token de validation dans la base de données
    async saveValidationToken(userId: number, token: string) {
        await this.usersRepository.update(userId, { validationToken: token });
    }


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


    // Méthode pour trouver un utilisateur par ID avec les permissions
    async findOneWithPermissions(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['permissions'], // Charge également les permissions associés
        });
        if (!user) {
            throw new NotFoundException(`user with ID ${id} not found`); // Throw an error if not found
        }
        return user; // Return the found user
    }

    // Méthode pour trouver des utilisateurs avec QueryBuilder
    async likeWithQueryBuilder(param: object): Promise<UserDTO[]> {
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
    async addUser(userData: Partial<UserDTO>) {
        
        if (userData.password !== userData.confirm_password) {
            throw new UnprocessableEntityException('The passwords do not match.');
        }
        //encrypt and update the received password
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword ;

        // Assign permissions to the user
        const permissionNames : string[] = this.getPermissionsForRoles(UserRole.ADMINISTRATEUR);

        // Create the new user
        let savedUser  = this.usersRepository.create(userData);
        // newUser.validationToken = this.generateToken(); // Génération d'un token de validation
        // let savedUser = await this.usersRepository.save(newUser );

        
    
        try {
            if(savedUser.user_type == UserRole.ADMINISTRATEUR){
                //save into database
                savedUser = await this.assignPermissions(permissionNames,savedUser) ;
            }
           
            return plainToInstance(UserDTO, savedUser);
        } catch (error) {
            // Check if the error is a QueryFailedError and contains a duplicate entry message
            if (error instanceof QueryFailedError && error.message.includes('duplicate key value violates unique constraint')) {
                throw new UnprocessableEntityException('Email or username already exists'); // Return friendly error message
            }
            throw new UnprocessableEntityException(error.message)
        }   
    }

    async addUserGeneratedToken(user: Partial<User>): Promise<string>  {
 
         Object.assign(user, {'validationToken':this.generateToken()}); // Met à jour les propriétés de l'utilisateur avec les nouvelles données
         // Sauvegarde les modifications dans la base de données
        await this.usersRepository.save(user); 
        return user.validationToken;
    }


    // Method to assign permissions based on names
    async assignPermissions(permissionNames: string[], user: User): Promise<User> {
        // Recupère les permissions de base en fonction du rôles
        const rolepermissions : string[] = this.getPermissionsForRoles(user.user_type);
        const tabs: Permission[] = [];
        if(user.permissions){ 
            for (const p of user.permissions) {
                tabs.push(p);
            }
        }

        for (const permis of permissionNames) {
            if(Object.values(rolepermissions).includes( permis) ){ 

                let permission = null ;
                if(!user.permissions){ 
                    //verify if user has this permission 'permis' registered in database
                    let query = this.permissionRepository.createQueryBuilder('permissions');
                    query = query.andWhere('permissions.userId = :value', { value : `%${user.id}%` }).andWhere('permissions.permission = :value', { value : `%${permis}%` });
                    // Recupère la permission correspondante
                    permission =  await query.getOne(); 
                }else{
                    
                    //Si un user a déja des permissions Vérifiez si la permission  'permis' en fait parti
                    const existingPermissionIndex = user.permissions.findIndex(item => item.permission === permis);
                    if (existingPermissionIndex > -1) {
                        // Si la permission existe déjà
                        permission = user.permissions[existingPermissionIndex] 
                    } 
                }
                  
                if (!permission) {
                    // If permission does not exist, create it
                    const permissionn = this.permissionRepository.create({ 'permission': permis});
                    await this.permissionRepository.save(permissionn);
                    tabs.push(permissionn);
                }
            }
        }

        if(tabs.length != 0){
            // Associate permissions with the user
            user.permissions = tabs;
            user = await this.usersRepository.save(user);
        }
        return  user ;
    }


    // Méthode pour attribuer une permission à un utilisateur
    async assignPermissions_(userId: number, incomepermissions: string[]):  Promise<User> {
        const user: User = await this.findOneWithPermissions(userId);
        if (!user) throw new NotFoundException(`User with ID ${userId} not found`);
        if( !Object.values(UserRole).includes(user.user_type) ) throw new NotFoundException(`Unknown role : ${user.user_type} found`); // Throw an error if not found
        if( UserRole.ADMINISTRATEUR !== user.user_type) throw new NotFoundException(`User with ID ${userId} is not admin`); // Throw an error if not admin
       
        const savedU = await this.assignPermissions(incomepermissions,user) ;
        return savedU ;
    }


    // Méthode pour attribuer une permission à un utilisateur
    async removePermissions(userId: number, incomepermissions: string[]):  Promise<User> {
        const user: User = await this.findOneWithPermissions(userId);
        if (!user) throw new NotFoundException(`User with ID ${userId} not found`);
        if( !Object.values(UserRole).includes(user.user_type) ) throw new NotFoundException(`Unknown role : ${user.user_type} found`); // Throw an error if not found
        if( UserRole.ADMINISTRATEUR !== user.user_type) throw new NotFoundException(`User with ID ${userId} is not admin`); // Throw an error if not admin
       

        for (const permis of incomepermissions) {
            // Find the index of the OrderItem that matches the productId
            const itemIndex = user.permissions.findIndex(item => item.permission === permis)
            if (itemIndex > -1) {
                // Si la permission existe déjà
                // Remove the OrderItem from the array
                user.permissions.splice(itemIndex, 1)[0];
            }
        }
        return await this.usersRepository.save(user);
    }



    // Méthode pour obtenir les permissions liés aux rôles
    private getPermissionsForRoles(role: UserRole): string[] {
            const ff = Object.values(UserRole) ;
        if (!Object.values(UserRole).includes(role))  throw new NotFoundException(`Unknown role : ${role} not found`); // Throw an error if not found
        const permissions: string[] = [];
        permissions.push(...rolePermissions[role]);
        
        return [...new Set(permissions)]; // Éliminer les doublons
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
    async deleteUser(userId: number): Promise<boolean> {
        

        try {
            // Supprime l'utilisateur par ID
            const result = await this.usersRepository.delete(userId);
            if (!result) {
                throw new NotFoundException(`User with ID ${userId} not found.`);
            }
            return true ; 
        } catch (error) {
            // Handle specific error types or log the error
            // console.error('Error deleting user:', error);
            if (error instanceof NotFoundException) {
                throw error; // Rethrow if it's a known exception
            }
            // Optionally log unexpected errors
            console.error('Error deleting user:', error);
            throw new Error('Failed to delete user'); // Generic error message
        }
        
    }

     // Méthode pour valider le token lors de la confirmation de l'email
     async validateToken(token: string): Promise<User | null> {
        return await this.usersRepository.findOne({ where: { validationToken: token } }); // Recherche un utilisateur avec le token donné
    }

    // Méthode pour confirmer l'utilisateur après validation du token
    async confirmUser(userId: number) {
        await this.usersRepository.update(userId, { isVerified: true, validationToken: null }); // Marque l'utilisateur comme vérifié et supprime le token
    }
}

