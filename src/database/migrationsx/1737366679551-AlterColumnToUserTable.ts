import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterColumnToUserTable1737366679551 implements MigrationInterface {
    name = 'AlterColumnToUserTable1737366679551'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Step 2: Drop the merchantId column
      await queryRunner.query(`ALTER TABLE users DROP COLUMN date_of_birth;`);

        await queryRunner.addColumn("users", new TableColumn(
                      {
                          name: "date_of_birth",
                          type: 'date',
                          isNullable: true,
                      },
                      
                  )); 
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    
    }

}
