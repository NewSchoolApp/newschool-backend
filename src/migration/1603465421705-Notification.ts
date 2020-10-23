import { MigrationInterface, QueryRunner } from 'typeorm';

export class Notification1603465421705 implements MigrationInterface {
  name = 'Notification1603465421705';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `notification` ADD `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)',
    );
    await queryRunner.query(
      'ALTER TABLE `notification` ADD `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)',
    );
    await queryRunner.query(
      'ALTER TABLE `notification` ADD `version` int NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `notification` ADD `seen` tinyint NOT NULL DEFAULT 1',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `notification` DROP COLUMN `seen`');
    await queryRunner.query('ALTER TABLE `notification` DROP COLUMN `version`');
    await queryRunner.query(
      'ALTER TABLE `notification` DROP COLUMN `updatedAt`',
    );
    await queryRunner.query(
      'ALTER TABLE `notification` DROP COLUMN `createdAt`',
    );
  }
}
