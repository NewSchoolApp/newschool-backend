import { MigrationInterface, QueryRunner } from 'typeorm';

export class Comment1606580856417 implements MigrationInterface {
  name = 'Comment1606580856417';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `comment` DROP COLUMN `partId`');
    await queryRunner.query('ALTER TABLE `comment` ADD `partId` int NOT NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `comment` DROP COLUMN `partId`');
    await queryRunner.query(
      'ALTER TABLE `comment` ADD `partId` varchar(36) NOT NULL',
    );
  }
}
