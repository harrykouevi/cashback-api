import { MigrationInterface, QueryRunner ,TableColumn} from "typeorm";

export class AddNewColumnToUser1733322752319  implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
           await queryRunner.addColumn("users", new TableColumn(
                {
                    name: "firstname",
                    type: 'varchar',
                    isNullable: true,
                },
                
            ));

            await queryRunner.addColumn("users", new TableColumn(
                {
                    name: "username",
                    type: 'varchar',
                },
                
            ));
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove the 'age' column from the 'users' table
        // await queryRunner.query(
        //     `ALTER TABLE users DROP COLUMN age`
        // );
    }
}