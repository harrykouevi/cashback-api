import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCashbackTable1670000000008 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'cashbacks',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'transaction_id',
            type: 'int',
          },
          {
            name: 'percentage',
            type: 'decimal',
            precision: 5,
            scale: 2, // Pourcentage
          },
          {
            name: 'cashback_amount',
            type: 'decimal',
              precision :10,
              scale :2,
           },
           {
             name : "request_date",
             type : "timestamp",
             default : "CURRENT_TIMESTAMP"
           },
           {
             name : "status",
             type : "enum",
             enum : ["Pending", "Approved", "Rejected"]
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
           }
         ],
         foreignKeys : [
           {
             columnNames : ["transaction_id"],
             referencedTableName : "transactions",
             referencedColumnNames : ["id"],
             onDelete : "CASCADE" // Supprimer les demandes de cashback si la transaction est supprimé
           }
         ]
       })
     );
   }
 
   public async down(queryRunner : QueryRunner) : Promise < void > {
     await queryRunner.dropTable('cashbacks');
   }
}
