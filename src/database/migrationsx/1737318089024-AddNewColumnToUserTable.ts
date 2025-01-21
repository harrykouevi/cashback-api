import { MigrationInterface, QueryRunner ,TableColumn ,TableForeignKey } from "typeorm";

export class AddNewColumnToUserTable1737318089024 implements MigrationInterface {
    name = 'AddNewColumnToUserTable1737318089024'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if the column already exists
        const table = await queryRunner.getTable("users");
        let columnExists = table?.columns.find(column => column.name === "merchantId"); // Replace "newColumn" with your new column name
        if (!columnExists) {
            await queryRunner.addColumn("users", new TableColumn(
                {
                    name: "merchantId",
                    type: 'int',
                    isNullable: true,
                },
                
            )); 

            await queryRunner.createForeignKey("users", new TableForeignKey({
                columnNames: ["merchantId"],
                referencedTableName: "merchants",
                referencedColumnNames: ["id"], // Assuming 'id' is the primary key in 'merchants'
                onDelete: "CASCADE", // Optional: Define what happens on delete
            }));
        }

      
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("users");
        let columnExists = table?.columns.find(column => column.name === "merchantId");

        if (columnExists) {
            await queryRunner.dropColumn("users", "merchantId");
        }

      
    }

}
