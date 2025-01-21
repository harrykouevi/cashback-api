import { MigrationInterface, QueryRunner , Table  } from "typeorm";

export class CreatMerchantsTable1737317603861 implements MigrationInterface {
    name = 'CreatMerchantsTable1737317603861'


    public async up(queryRunner: QueryRunner): Promise<void> {
      
      // const table = await queryRunner.getTable("users");
      // let columnExists = table?.columns.find(column => column.name === "merchantId");

      // await queryRunner.query(`ALTER TABLE users DROP FOREIGN KEY FK_af94df2e060180b6043d5e45042;`);

      // // Step 2: Drop the merchantId column
      // await queryRunner.query(`ALTER TABLE users DROP COLUMN merchantId;`);

      // await queryRunner.dropTable('merchants');

      await queryRunner.createTable(
          new Table({
            name: 'merchants',
            columns: [
              {
                name: 'id',
                type: 'int',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment', // Optional; defaults to 'increment'
              },
              {
                name: 'name',
                type: 'varchar',
              },
              {
                name: 'email',
                type: 'varchar',
                isUnique: true,
              },
              {
                name: 'website_url',
                type: 'varchar',
                isNullable: true,
              },
              {
                name: 'address',
                type: 'varchar',
                isNullable: true,
              },
              {
                name: 'commission_rate',
                type: 'decimal',
                precision: 5,
                scale: 2, // Pourcentage
                default: 0,
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
          }),
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('merchants');
      }

}
