import { MigrationInterface, QueryRunner, Table } from 'typeorm';


export class CreateOrdersTable1732542503650 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: 'orders',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                },
                {
                    name: 'userid',
                    type: 'int',
                },
                {
                    name: 'promocodeid',
                    type: 'int',
                    isNullable: true, // Allow NULL values
                },
                {
                    name: 'total_amount',
                    type: 'decimal',
                    default: 0,
                    precision :10,
                    scale :2,
                },
                {
                    name : "orderdate",
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
                    name: 'definitive_amount',
                    type: 'decimal',
                    default: 0,
                    precision :10,
                    scale :2,
                },
                {
                    name: 'promocode',
                    type: 'varchar',
                    isNullable: true, // Allow NULL values
                },
                {
                    name : "status",
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
                {
                    columnNames : ["userid"],
                    referencedTableName : "users",
                    referencedColumnNames : ["id"],
                    onDelete : "CASCADE" // Supprimer les commandes si l'utilisateur est supprimé
                },
                {
                    columnNames : ["promocodeid"],
                    referencedTableName : "promocodes",
                    referencedColumnNames : ["id"],
                    onDelete : "CASCADE" // Supprimer les commandes si l'utilisateur est supprimé
                }
             ]
           })
         );
       }
     
       public async down(queryRunner : QueryRunner) : Promise < void > {
         await queryRunner.dropTable('orders');
       }
}
