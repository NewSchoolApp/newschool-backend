import { MigrationInterface, QueryRunner } from 'typeorm';

export class Badge1601428874329 implements MigrationInterface {
  name = 'Badge1601428874329';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `badge` DROP COLUMN `points`');
    await queryRunner.query(
      'ALTER TABLE `achievement` ADD `points` int NOT NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `achievement` DROP COLUMN `points`');
    await queryRunner.query('ALTER TABLE `badge` ADD `points` int NOT NULL');
  }
}
