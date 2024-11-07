import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePaymentsTable1670000000004 implements MigrationInterface {

   public async up(queryRunner : QueryRunner) : Promise < void > {

     await queryRunner.createTable(
       new Table({
         name : "payments",
         columns : [
           {
             name : "id",
             type : "int",
             isPrimary : true,
             isGenerated : true
           },
           {
             name : "amount_paid",
             type : "decimal",
               precision :10,
               scale :2
           },
           {
             name :"payment_date",
             type :"timestamp",
             default :"CURRENT_TIMESTAMP"
           },
           {
             name :"payment_method_id",
             type : "int"
           },
           {
              name: 'cashout_id',
              type: 'int',
              isNullable: true, // Allow NULL values
            },
            {
              name: 'transaction_id',
              type: 'int',
              isNullable: true, // Allow NULL values
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
            columnNames:["payment_method_id"],
            referencedTableName:"paymentmethods",
            referencedColumnNames:["id"],
            onDelete:"CASCADE" // Supprimer les paiements si la method de paiemenent est supprimé
          },
         ]
       })
     );
   }

   public async down(queryRunner : QueryRunner) : Promise < void > {

     await queryRunner.dropTable("payments");
   }
}
