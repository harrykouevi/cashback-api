import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePermissionsTable1733322752318 implements MigrationInterface {
    name = 'CreatePermissionsTable1733322752318'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: 'permissions',
              columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                    },
                    {
                        name: 'permission',
                        type: 'varchar',
                    },
                    {
                        name: 'user_id',
                        type: 'int',
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
                        columnNames : ["user_id"],
                        referencedTableName : "users",
                        referencedColumnNames : ["id"],
                        onDelete : 'SET NULL' // Supprimer les demandes de cashback si la transaction est supprimé
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
           }

}
