import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTransactionsTable1670000000007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transactions',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'user_id',
            type: 'int',
          },
          {
            name: 'merchant_id',
            type: 'int',
          },
        
          {
            name: 'payment_id',
            type: 'int',
            isNullable: true, // Allow NULL values

          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'transaction_date',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        //   {
        //     name: 'status',
        //     type: 'enum',
        //     enum: ['Pending', 'Confirmed', 'Rejected'],
        //   },
        
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE', // Supprimer les transactions si l'utilisateur est supprimé
          },

          {
            columnNames: ['merchant_id'],
            referencedTableName: 'merchants',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE', // Supprimer les transactions si l'utilisateur est supprimé
          },

          {
            columnNames: ['payment_id'],
            referencedTableName: 'payments',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE', // Supprimer les transactions si l'utilisateur est supprimé
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('transactions');
  }
}
