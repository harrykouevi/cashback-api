import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProductsTable1732965960769 implements MigrationInterface {
    name = 'CreateProductsTable1732965960769'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: 'products',
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
                    {
                        name: 'category_id',
                        type: 'int',
                    },
                    {
                        name: 'price',
                        type: 'decimal',
                        precision :10,
                        scale :2,
                    },
                    {
                        name: 'stock',
                        type: 'int',
                        default : 0
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
                    columnNames : ["category_id"],
                    referencedTableName : "categories",
                    referencedColumnNames : ["id"],
                    onDelete : "CASCADE" // Supprimer les demandes de cashback si la transaction est supprimé
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}

}
