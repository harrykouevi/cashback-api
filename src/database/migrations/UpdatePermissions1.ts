import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePermissions1670000000012  implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(
            `ALTER TABLE permissions ENGINE=InnoDB;`
        );
        await queryRunner.query(
            `ALTER TABLE permissions DROP FOREIGN KEY FK_eab26c6cc4b9cc604099bc32dff;`
        );

        await queryRunner.query(
            `ALTER TABLE permissions ADD CONSTRAINT FK_eab26c6cc4b9cc604099bc32dff FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL ON UPDATE NO ACTION;`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
       
    }
}