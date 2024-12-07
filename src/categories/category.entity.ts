import { IsNotEmpty , IsOptional , IsNumber , IsEmail, IsDate, IsDateString, Equals} from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany , Index ,JoinColumn} from 'typeorm';
import { Product } from '../product/product.entity';


@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 }) // Champ pour le montant total vendu
  totalSold: number;


  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
 
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Index() // Ajout de l'index ici
  @Column({ nullable: true }) // Champ pour stocker l'ID de la catégorie parente
  parent_id: number;

  @JoinColumn({ name: 'parent_id', referencedColumnName: "id" }) // Personnalise le nom de la colonne dans la table Photo
  @ManyToOne(() => Category, (category) => category.subCategories)
  parentCategory: Category;

  @OneToMany(() => Category, (category) => category.parentCategory)
  subCategories: Category[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

}



//DTO class that defines the structure of data and includes validation rules for User creation.
export class CategoryDTO {
  @IsNotEmpty() // Ensures the name field is not empty
  name: string;


  @IsOptional()
  description: string;

  @IsOptional()
  @IsNumber() // Ensures the value is a number
  parent_id:  number;
}