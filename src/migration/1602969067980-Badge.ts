import { MigrationInterface, QueryRunner } from 'typeorm';

export class Badge1602969067980 implements MigrationInterface {
  name = 'Badge1602969067980';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `achievement` CHANGE `points` `eventName` int NOT NULL',
    );
    await queryRunner.query(
      "ALTER TABLE `badge` ADD `eventName` enum ('CourseReward::TestOnFirstTake') NOT NULL",
    );
    await queryRunner.query(
      'ALTER TABLE `badge` ADD `eventOrder` int NOT NULL',
    );
    await queryRunner.query('ALTER TABLE `badge` ADD `points` int NOT NULL');
    await queryRunner.query(
      'ALTER TABLE `achievement` DROP COLUMN `eventName`',
    );
    await queryRunner.query(
      "ALTER TABLE `achievement` ADD `eventName` enum ('CourseReward::TestOnFirstTake') NOT NULL",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `achievement` DROP COLUMN `eventName`',
    );
    await queryRunner.query(
      'ALTER TABLE `achievement` ADD `eventName` int NOT NULL',
    );
    await queryRunner.query('ALTER TABLE `badge` DROP COLUMN `points`');
    await queryRunner.query('ALTER TABLE `badge` DROP COLUMN `eventOrder`');
    await queryRunner.query('ALTER TABLE `badge` DROP COLUMN `eventName`');
    await queryRunner.query(
      'ALTER TABLE `achievement` CHANGE `eventName` `points` int NOT NULL',
    );
  }
}
