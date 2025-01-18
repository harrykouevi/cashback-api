import { InjectRepository } from '@nestjs/typeorm';
import { Repository,QueryFailedError } from 'typeorm';
import { Injectable, NotFoundException, BadRequestException , UnprocessableEntityException} from '@nestjs/common';
import { Order, Status } from './order.entity';
import { Product } from '../product/product.entity';
import { AddProductToOrderDTO, OrderItem } from '../order/orderitem.entity';
// import { AddProductToOrderDTO, OrderItem } from '../orderitem/orderitem.entity';
import { ProductService } from '../product/product.service'; // Import du service produit
import { PromocodeService } from 'src/promocode/promocode.service';
import { Promocode } from 'src/promocode/promocode.entity';
import { CategoriesService } from 'src/categories/categories.service';


// Service pour gérer le panier d'achats
@Injectable()
export class OrderService {
   
    constructor(
        @InjectRepository(Order)// Injection du repository pour l'entité Order
        private orderRepository: Repository<Order>,

        @InjectRepository(OrderItem)// Injection du repository pour l'entité OrderItem
        private orderitemsRepository: Repository<OrderItem>,

        private readonly promocodeService : PromocodeService ,

        private readonly productService: ProductService ,// Injection du service produit

        private readonly categoriesService : CategoriesService , // Injection du service category
    ) {} 


    // Méthode pour ajouter un article au panier
    async addProductToOrder(orderId: number, orderitem : Partial<OrderItem>): Promise<Order> {
        
        // Vérification si la commande existe
        const order = await this.findOneWithItems(orderId);
        // Vérifiez si le produit existe dans la base de données
        const product: Product = await this.productService.findById(orderitem.productId);
        
        orderitem.priceatorder = product.price ;
        // Vérifiez si le produit existe déjà dans la commande
        const existingProductIndex = order.orderitems.findIndex(item => item.productId === product.id);
        if (existingProductIndex > -1) {
            // Si le produit existe déjà, mettez à jour la quantité
            order.orderitems[existingProductIndex].quantity += orderitem.quantity;
        } else {
            const  newOrderItem = this.orderitemsRepository.create(orderitem);
            await this.orderitemsRepository.save( newOrderItem);
            order.orderitems.push(newOrderItem); // Add to the order items array
        }
        // Mettez à jour le montant total de la commande
        const productPrice = product.price; // Récupérer le prix du produit
        order.total_amount += productPrice * orderitem.quantity;
        order.definitive_amount =order.total_amount 

        return this.orderRepository.save(order);
    }

    // Méthode pour ajouter un article au panier
    async applyPromotionToOrder(orderId: number, code_ : string): Promise<Order> {
        
        // Vérification si la commande existe
        const order = await this.findById( orderId);
        if (order.status !== Status.VALIDED) {
            throw new NotFoundException(`Order with ID ${orderId} must be valided before.`);
        }

        // Vérifiez si le produit existe dans la base de données
        const promocodes: Promocode[] = await this.promocodeService.findWithQueryBuilder({'code':code_ , 'isActive' : 1});
        const promocode = promocodes[0];
        if (!promocode) {
            throw new NotFoundException(`Promocode with active code: ${code_} not found`);
        }
       
        order.promocod =  code_ ;
        order.discountpercentage =   promocode.discountpercentage ;

        order.definitive_amount = order.total_amount - (order.total_amount * promocode.discountpercentage / 100);

        return this.orderRepository.save(order);
    }


    // Méthode pour retirer un article du panier
    async removeProductFromOrder(orderId: number, productId: number): Promise<Order> {

        const order = await this.findOneWithItems(orderId );
        // Find the index of the OrderItem that matches the productId
        const orderItemIndex = order.orderitems.findIndex(item => item.productId === productId);
        if (orderItemIndex === -1) {
            throw new NotFoundException(`OrderItem with product ID ${productId} not found in order`);
        }

        // Remove the OrderItem from the array
        const removedOrderItem = order.orderitems.splice(orderItemIndex, 1)[0];
        // Mettez à jour le montant total de la commande
        const productPrice = removedOrderItem.priceatorder; // Récupérer le prix du produit
        order.total_amount -= productPrice * removedOrderItem.quantity;
        await this.orderitemsRepository.remove(removedOrderItem);

        return this.orderRepository.save(order);
    }
    

    // Méthode pour trouver des codes promo  en fonction de deux paramètres
    async findByParams(param1?: string, param2?: string): Promise<Order[]> {
        // Objet pour stocker les paramètres de recherche
        const params = {}; 

        if (param1) params['param1'] = param1; // Ajout de param1 si fourni
        if (param2) params['param2'] = param2; // Ajout de param2 si fourni
        // Exécution de la recherche
        return this.orderRepository.find({ where: params }); 
    }


    // Méthode pour récupérer tous lese orders
    async findAll() : Promise<Order[]>{
        // Exécution de la recherche en utilisant le repository
        const orders =  await this.orderRepository.find();
        return orders; 
    }

    // Méthode pour trouver une commande  par ID
    async findById(id: number): Promise<Order> {
        const order = await this.orderRepository.findOneBy({id }); // Find Order by ID
        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found`); // Throw an error if not found
        }
        
        return order; // Return the found Order
    }

   

    // Méthode pour trouver un produit  par ID
    async findOneWithItems(id: number): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['orderitems'], // Charge également les produits associés
        });
        if (!order) {
            throw new NotFoundException(`order with ID ${id} not found`); // Throw an error if not found
        }
        return order; // Return the found order
    }


     // Méthode pour trouver un produit  par ID
     async findOneWithItemProducts(id: number): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['orderitems.product'], // Charge également les produits associés
        });
        if (!order) {
            throw new NotFoundException(`order with ID ${id} not found`); // Throw an error if not found
        }
        return order; // Return the found order
    }

    // Méthode pour trouver des codes promo  avec QueryBuilder
    async likeWithQueryBuilder(param: object): Promise<Order[]> {
        const query = this.orderRepository.createQueryBuilder('Order');
        
        Object.entries(param).forEach(([key, value]) => { 
            query.andWhere('order.'+key+' LIKE :value', { value : `%${value}%` });
        });
        // Recupère un tableau de codes promo  correspondants
        const orders =  await query.getMany(); 
        return orders; 
    }

    // Méthode pour ajouter une commande 
    async addOrder(data: Partial<Order>) : Promise<Order> {

        const order = this.orderRepository.create(data);

        try {
            //save into database
            await this.orderRepository.save(order);
        } catch (error) {
            // Check if the error is a QueryFailedError and contains a duplicate entry message
            if (error instanceof QueryFailedError && error.message.includes('duplicate key value violates unique constraint')) {
                throw new UnprocessableEntityException('Order already exists'); // Return friendly error message
            }
            throw new UnprocessableEntityException(error.message)
        }
       
        return order;
    }

    // Méthode pour mettre à jour les détails d'une commande  par ID
    async updateOrder(id: number, data: Partial<Order>): Promise<Order> {
        // Recherche la commande par ID
        const order=  await this.findById(id); 

        if (!order) {
            // Lève une exception si la commande n'existe pas
            throw new NotFoundException(`Order with ID ${id} not found`); 
        }
        Object.assign(order, data); // Met à jour les propriétés du orderavec les nouvelles données
        // Sauvegarde les modifications dans la base de données
        return this.orderRepository.save(order); 
    }


    async cancelOrder(orderId: number): Promise<Order> {
        const order = await this.findById(orderId);
        // Mettre à jour le statut de la commande pour indiquer qu'elle est annulée
        Object.assign(order, {status:Status.CANCELLED});

        // Enregistrer les modifications dans la base de données
        return this.orderRepository.save(order);
    }

    async checkoutOrder(orderId: number): Promise<Order> {
        const order = await this.findOneWithItemProducts(orderId);

        await this.categoriesService.statisticUpdating(order) ;
        // Mettre à jour le statut de la commande pour indiquer qu'elle est annulée
        Object.assign(order, {status:Status.PAYED});

        // Enregistrer les modifications dans la base de données
        return this.orderRepository.save(order);

    }

    
}