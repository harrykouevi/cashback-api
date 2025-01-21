import { MigrationInterface, QueryRunner ,TableColumn } from "typeorm";
import * as bcrypt from 'bcrypt';


export class InsertINUserTable1737454213821 implements MigrationInterface {
    name = 'InsertINUserTable1737454213821'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE users DROP COLUMN password;`);
        await queryRunner.query(`ALTER TABLE users DROP COLUMN name;`);
        await queryRunner.query(`ALTER TABLE users DROP COLUMN date_of_birth;`);

        await queryRunner.addColumn("users", new TableColumn(
                      {
                          name: "date_of_birth",
                          type: 'date',
                          isNullable: true,
                      },
                      
                  )); 
        
        await queryRunner.addColumn("users", new TableColumn(
                        {
                            name: "name",
                            type: 'varchar',
                            isNullable: true,
                        },
                        
                    )); 
        await queryRunner.addColumn("users", new TableColumn(
                        {
                            name: "password",
                            type: 'varchar',
                            isNullable: true,
                        },
                        
                    )); 
        const p : string = await bcrypt.hash('password', 10) ;            
        await queryRunner.query(
            `INSERT INTO users (email ,username ,user_type,password) VALUES 
            ('admin@example.com', 'adminprimer','admin', '${ p}')`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DELETE FROM "users" WHERE "email" IN ('admin@example.com')`
        );
    }

}
