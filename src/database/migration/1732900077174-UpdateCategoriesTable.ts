import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class UpdateCategoriesTable1732900077174 implements MigrationInterface {
    name = 'UpdateCategoriesTable1732900077174'

    public async up(queryRunner: QueryRunner): Promise<void> {
       
        // Add a new column 'age' to the 'users' table
        // await queryRunner.query(
        //     ` ALTER TABLE categories ADD COLUMN parent_id INT NULL`
        // );

         // Add user_id column
         await queryRunner.addColumn("categories", new TableColumn({
            name: "parent_id",
            type: "int",
            isNullable: true,
        }));


        // Ajouter la contrainte de clé étrangère
        //await queryRunner.query(" ALTER TABLE `categories` ADD CONSTRAINT `fk_parent_id` FOREIGN KEY (`parent_id`)  REFERENCES `categories` (`id`) ON DELETE CASCADE;" );
        // Step 2: Create a foreign key for the new column
        await queryRunner.createForeignKey(
            "categories",
            new TableForeignKey({
                columnNames: ["parent_id"], // Column in the 'answer' table
                referencedTableName: "categories", // Table being referenced
                referencedColumnNames: ["id"], // Column in the 'question' table
                onDelete: "CASCADE", // Optional: specify the delete behavior
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
    }

}
