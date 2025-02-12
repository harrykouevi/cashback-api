import { MigrationInterface, QueryRunner, Table } from 'typeorm';


export class CreateGiftCardsTable1739371641512 implements MigrationInterface {
    name = 'CreateGiftCardsTable1739371641512'

   
        public async up(queryRunner: QueryRunner): Promise<void> {

              // Check if the table exists
            const tableExists = await queryRunner.hasTable('gift_cards'); // Replace 'gift_cards' with your table name if different

            // Drop the table if it exists
            if (tableExists) {
                await queryRunner.dropTable('gift_cards'); // Replace 'gift_cards' with your table name if different
            }
            await queryRunner.createTable(
                new Table({
                    name: 'gift_cards', // Nom de la table
                    columns: [
                        {
                            name: 'id',
                            type: 'int',
                            isPrimary: true,
                            isGenerated: true,
                            generationStrategy: 'increment',
                        },
                        {
                            name: 'imageUrl',
                            type: 'varchar',
                            length: '255', // Longueur maximale de l'URL
                            isNullable: true, // L'image est obligatoire
                        },
                        {
                            name: 'expirationDate',
                            type: 'timestamp', // Ou 'date' si vous ne voulez pas l'heure
                            isNullable: false,
                        },
                        {
                            name: 'cashbackPercentage',
                            type: 'decimal', // Utiliser decimal pour les pourcentages
                            precision: 5, // Nombre total de chiffres (avant et après la virgule)
                            scale: 2,     // Nombre de chiffres après la virgule (ex: 10.50)
                            isNullable: false,
                        },
                        {
                            name: 'amount',
                            type: 'decimal',
                            precision: 10, // Montant total de chiffres
                            scale: 2, 
                            default: 0,    // 2 chiffres après la virgule (ex: 100.00)
                            isNullable: false,
                        },
                        {
                            name: 'code',
                            type: 'varchar',
                            length: '50', // Ajustez la longueur en fonction de votre système de code
                            isUnique: true, // Chaque carte doit avoir un code unique
                            isNullable: false,
                        },
                        {
                            name: 'created_at',
                            type: 'timestamp',
                            default: 'now()',
                        },
                        {
                            name: 'updated_at',
                            type: 'timestamp',
                            default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
                        },
    
                        // Vous pouvez ajouter d'autres colonnes selon vos besoins
                    ],
                }),
                true, // ifExist
            );
        }
    
        public async down(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.dropTable('gift_cards');
        }
    }
    