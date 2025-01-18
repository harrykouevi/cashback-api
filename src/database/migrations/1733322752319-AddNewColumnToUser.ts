import { MigrationInterface, QueryRunner ,TableColumn} from "typeorm";

export class AddNewColumnToUser1733322752319  implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if the column already exists
        const table = await queryRunner.getTable("users");
        let columnExists = table?.columns.find(column => column.name === "firstname"); // Replace "newColumn" with your new column name
        if (!columnExists) {
            await queryRunner.addColumn("users", new TableColumn(
                {
                    name: "firstname",
                    type: 'varchar',
                    isNullable: true,
                },
                
            )); 
        }

        columnExists = table?.columns.find(column => column.name === "username"); // Replace "newColumn" with your new column name
        if (!columnExists) {
            await queryRunner.addColumn("users", new TableColumn(
                {
                    name: "username",
                    type: 'varchar',
                },
                
            ));
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("users");
        let columnExists = table?.columns.find(column => column.name === "username");

        if (columnExists) {
            await queryRunner.dropColumn("users", "username");
        }

        columnExists = table?.columns.find(column => column.name === "firstname");

        if (columnExists) {
            await queryRunner.dropColumn("users", "firstname");
        }
    }
}