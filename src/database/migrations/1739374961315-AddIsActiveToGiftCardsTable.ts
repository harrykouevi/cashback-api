import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddIsActiveToGiftCards1739374961315 implements MigrationInterface { //Replace <timestamp> with the creation timestamp
     name = 'AddIsActiveToGiftCards1739374961315'
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'gift_cards',
            new TableColumn({
                name: 'is_active',
                type: 'boolean',
                default: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('gift_cards', 'is_active');
    }
}
