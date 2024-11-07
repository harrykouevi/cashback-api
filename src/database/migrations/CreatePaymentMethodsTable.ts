import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePaymentMethodsTable1670000000003 implements MigrationInterface {

   public async up(queryRunner : QueryRunner) : Promise < void > {

     await queryRunner.createTable(
       new Table({
         name : "paymentmethods",
         columns : [
           {
             name : "id",
             type : "int",
             isPrimary : true,
             isGenerated : true
           },
           {
            name: 'method_name',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'Details',
            type: 'text',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
          },
          
         ],
      
       })
     );
   }

   public async down(queryRunner : QueryRunner) : Promise < void > {

     await queryRunner.dropTable("paymentmethods");
   }
}
