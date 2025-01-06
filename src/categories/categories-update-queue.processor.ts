import { UnprocessableEntityException } from '@nestjs/common';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CategoriesService } from './categories.service';
import { Product } from 'src/product/product.entity';
import { NotificationService } from 'src/notification/notification.service';
import { Category } from './category.entity';


@Processor('category-update-queue')
export class CategoryUpdateQueueProcessor {
  constructor(
    private readonly categoryService: CategoriesService,
    private readonly notificationService: NotificationService,
    @InjectQueue('error-queue') private errorQueue: Queue,
  ) {}

  @Process()
  async handle(job: Job) {
    const amount : number = job.data.amount;
    let currentCategory : Category = job.data.parentCategory;
 
    try {
      while (currentCategory) {
        currentCategory.totalSold += amount; // Ajouter le prix du produit au total vendu
        // Sauvegarder les changements
        await this.categoryService.updateCategory(currentCategory.id,currentCategory); 
        // currentCategory = currentCategory.parentCategory; // Passer à la catégorie parente
        currentCategory = await this.categoryService.getCategoryHierarchy(currentCategory.id);
        currentCategory = currentCategory.parentCategory; // Passer à la catégorie parente

      }
     
    }
    catch (error) {
      // throw new UnprocessableEntityException(error.message)
      // Envoyer une notification en cas d'erreur
      // this.notificationService.sendErrorNotification(`Failed to process order for product ID ${orderData.productId}: ${error.message}`);

      // Vérifier si c'est la dernière tentative
      if (job.attemptsMade >= job.opts.attempts) {
        // Déplacer la tâche vers la queue d'erreurs uniquement si c'est la dernière tentative
        await this.errorQueue.add(currentCategory);
        console.log(`moved to error queue for category ID ${currentCategory.id}`);
      }
      // Optionnel : Vous pouvez également relancer la tâche si nécessaire
      throw error; // Cela déclenchera le mécanisme de retrait
    }
  }
}