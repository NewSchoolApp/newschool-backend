import { MigrationInterface, QueryRunner } from 'typeorm';

export class Achievement1606834118381 implements MigrationInterface {
  name = 'Achievement1606834118381';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `achievement` ADD `points` int NOT NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `achievement` DROP COLUMN `points`');
  }
}
