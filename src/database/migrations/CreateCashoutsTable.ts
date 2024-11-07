import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCashoutsTable1670000000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'cashouts',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'user_id',
            type: 'int',
          },
          {
            name: 'payment_id',
            type: 'int',
            isNullable: true, // Allow NULL values
          }
          ,
          {
            name: 'amount',
            type: 'decimal',
              precision :10,
              scale :2,
           },
           {
             name : "cashout_date",
             type : "timestamp",
             default : "CURRENT_TIMESTAMP"
           },
           {
             name : "status",
             type : "enum",
             enum : ["Pending", "Completed", "Rejected"]
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
             columnNames : ["user_id"],
             referencedTableName : "users",
             referencedColumnNames : ["id"],
             onDelete : "CASCADE" // Supprimer les demandes de cashback si l'utilisateur est supprimé
           },
           {
            columnNames : ["payment_id"],
            referencedTableName : "payments",
            referencedColumnNames : ["id"],
            onDelete : "CASCADE" // Supprimer les demandes de cashback si le payment est supprimé
          }
         ]
       })
     );
   }
 
   public async down(queryRunner : QueryRunner) : Promise < void > {
     await queryRunner.dropTable('cashouts');
   }
}
