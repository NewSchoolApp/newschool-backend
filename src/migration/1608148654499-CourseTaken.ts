import { MigrationInterface, QueryRunner } from 'typeorm';

export class CourseTaken1608148654499 implements MigrationInterface {
  name = 'CourseTaken1608148654499';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `client-credentials` DROP COLUMN `grantType`',
    );
    await queryRunner.query(
      'ALTER TABLE `course_taken` DROP COLUMN `challenge`',
    );
    await queryRunner.query(
      'ALTER TABLE `course_taken` ADD `challenge` varchar(500) NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `course_taken` DROP COLUMN `challenge`',
    );
    await queryRunner.query(
      'ALTER TABLE `course_taken` ADD `challenge` varchar(255) NULL',
    );
    await queryRunner.query(
      "ALTER TABLE `client-credentials` ADD `grantType` enum ('client_credentials', 'password', 'refresh_token') NOT NULL",
    );
  }
}
