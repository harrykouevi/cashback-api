import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      name: 'Cashback-API',
      version: '1.0.0',
      description: 'Ceci est une API pour gérer les opérations de cashback, y compris les transactions et les utilisateurs.',
      endpoints: [
         
      ]
     } ;
  }
}
