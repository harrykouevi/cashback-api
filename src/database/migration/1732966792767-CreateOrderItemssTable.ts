import { MigrationInterface, QueryRunner, Table } from 'typeorm';


export class CreateOrderItemsTable1732966792767 implements MigrationInterface {
    name = 'CreateOrderItemsTable1732966792767'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: 'orderitems',
              columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                    },
                    {
                        name: 'order_id',
                        type: 'int',
                    },
                    {
                        name: 'product_id',
                        type: 'int',
                    },
                    {
                        name: 'price_at_purchase',
                        type: 'decimal',
                        precision :10,
                        scale :2,
                    },
                    {
                        name: 'quantity',
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
                        columnNames : ["order_id"],
                        referencedTableName : "orders",
                        referencedColumnNames : ["id"],
                        onDelete : "CASCADE" // Supprimer les demandes de cashback si la transaction est supprimé
                    },
                    {
                        columnNames : ["product_id"],
                        referencedTableName : "products",
                        referencedColumnNames : ["id"],
                        onDelete : "CASCADE" // Supprimer les demandes de cashback si la transaction est supprimé
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
