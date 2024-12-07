import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnToUser1670000000009  implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add a new column 'age' to the 'users' table
        await queryRunner.query(
            `ALTER TABLE users ADD COLUMN is_active INT default 0`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove the 'age' column from the 'users' table
        // await queryRunner.query(
        //     `ALTER TABLE users DROP COLUMN age`
        // );
    }
}