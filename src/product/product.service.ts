import { Injectable } from '@nestjs/common';

// Service pour gérer les produits disponibles
@Injectable()
export class ProductService {
  // Simule une base de données de produits
  private products = [
    { id: 1, name: 'Produit A', stock: 10 },
    { id: 2, name: 'Produit B', stock: 0 }, // Produit en rupture de stock
    { id: 3, name: 'Produit C', stock: 5 },
  ];

  // Méthode pour trouver un produit par son ID
  findProductById(productId: number) {
    return this.products.find(product => product.id === productId);
  }
}