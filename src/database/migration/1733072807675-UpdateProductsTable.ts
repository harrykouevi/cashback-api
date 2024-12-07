import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";


export class UpdateProductsTable1733072807675 implements MigrationInterface {
    name = 'UpdateProductsTable1733072807675'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("products", new TableColumn({
            name: "isActivated",
            type : "enum",
            enum : ['en traitement','validé','payé','en cours de livraison',]
        }));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    
    }

}
