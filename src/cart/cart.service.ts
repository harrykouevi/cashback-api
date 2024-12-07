// src/cart/cart.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProductService } from '../product/product.service'; // Import du service produit

// Interface représentant un article dans le panier
interface CartItem {
  productId: number; // ID du produit
  quantity: number; // Quantité du produit
}

// Service pour gérer le panier d'achats
@Injectable()
export class CartService {
    private cart: CartItem[] = []; // Tableau pour stocker les articles du panier

    constructor(private readonly productService: ProductService) {} // Injection du service produit

    // Méthode pour ajouter un article au panier
    async  addToCart(productId: number, quantity: number) : Promise<any>{
        const product = await this.productService.findById(productId); // Recherche du produit

        // Vérification si le produit existe
        if (!product) {
            throw new NotFoundException(`Produit avec ID ${productId} non trouvé.`);
        }

        // Vérification de la validité de la quantité demandée
        if (quantity <= 0 || quantity > product.stock) {
            throw new BadRequestException(`Quantité invalide pour le produit ${productId}.`);
        }

        const existingItem = this.cart.find(item => item.productId === productId); // Vérification si l'article est déjà dans le panier
        if (existingItem) {
            existingItem.quantity += quantity; // Mise à jour de la quantité si l'article existe déjà
        } else {
            this.cart.push({ productId, quantity }); // Ajout d'un nouvel article au panier
        }

        return this.cart; // Retourne le contenu actuel du panier
    }

    // Méthode pour retirer un article du panier
    removeFromCart(productId: number) {
        this.cart = this.cart.filter(item => item.productId !== productId); // Filtre les articles pour retirer celui spécifié
        return this.cart; // Retourne le panier mis à jour
    }

    // Méthode pour obtenir le contenu actuel du panier
    getCart() {
        return this.cart;
    }

    // Méthode pour valider le panier avant l'achat
    async validatePurchase() {
        if (this.cart.length === 0) {
            throw new BadRequestException('Le panier est vide. Ajoutez des articles avant d\'acheter.');
        }

        for (const item of this.cart) {
            const product = await this.productService.findById(item.productId); // Vérifie chaque produit dans le panier
            if (!product || item.quantity > product.stock) {
                throw new BadRequestException(`Produit ${item.productId} non disponible en quantité suffisante.`);
            }
        }

        return true; // Validation réussie si toutes les vérifications passent
    }

    // Méthode pour vider le panier après un achat réussi
    clearCart() {
        this.cart = [];
    }
}