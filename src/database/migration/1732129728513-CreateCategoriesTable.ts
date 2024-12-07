import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCategoriesTable1670000000020 implements MigrationInterface {
  
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'categories',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          //  {
          //    name : "status",
          //    type : "enum",
          //    enum : ["Pending", "Approved", "Rejected"]
          //  },
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
         ]
       })
     );
   }
 
   public async down(queryRunner : QueryRunner) : Promise < void > {
     await queryRunner.dropTable('categories');
   }
}
