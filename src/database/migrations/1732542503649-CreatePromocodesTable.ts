import { MigrationInterface, QueryRunner, Table } from 'typeorm';


export class CreatePromocodesTable1732542503649 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: 'promocodes',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                },
                {
                    name: 'code',
                    type: 'varchar',
                },
                {
                    name : "startdate",
                    type: 'date',
                },
                {
                    name : "enddate",
                    type: 'date',
                },
                {
                    name: 'discountpercentage',
                    type: 'decimal',
                    default: 0,
                    precision: 5,
                    scale: 2, // Pourcentage
                },
                {
                    name : "isActive",
                    type : "enum",
                    enum : ['en traitement','validé','payé','en cours de livraison',]
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
                
             ]
           })
         );
       }
     
       public async down(queryRunner : QueryRunner) : Promise < void > {
         await queryRunner.dropTable('promocodes');
       }
}
