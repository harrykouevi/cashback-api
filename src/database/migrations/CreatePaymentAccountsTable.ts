import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePaymentAccountsTable1670000000004 implements MigrationInterface {

   public async up(queryRunner : QueryRunner) : Promise < void > {

     await queryRunner.createTable(
       new Table({
         name : "paymentaccounts",
         columns : [
           {
             name : "id",
             type : "int",
             isPrimary : true,
             isGenerated : true
           },
           {
             name : "user_id",
             type : "int"
           },
           {
            name: 'account_type',
            type: 'enum',
            enum: ['bank', 'paypal'],
            default: `'paypal'`,
          },
          {
            name: 'account_details',
            type: 'varchar',
            isUnique: true,
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
         foreignKeys:[
           {
             columnNames:["user_id"],
             referencedTableName:"users",
             referencedColumnNames:["id"],
             onDelete:"CASCADE" // Supprimer les comptes si l'utilisateur est supprimé
           },
           
         ]
       })
     );
   }

   public async down(queryRunner : QueryRunner) : Promise < void > {

     await queryRunner.dropTable("paymentaccounts");
   }
}
