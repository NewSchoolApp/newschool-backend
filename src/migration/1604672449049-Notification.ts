import { MigrationInterface, QueryRunner } from 'typeorm';

export class Notification1604672449049 implements MigrationInterface {
  name = 'Notification1604672449049';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `notification` ADD `enabled` tinyint NOT NULL DEFAULT 1',
    );
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `inviteKey` `inviteKey` varchar(255) NOT NULL DEFAULT 'yci1iatvgp'",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `inviteKey` `inviteKey` varchar(255) NOT NULL DEFAULT 'xuzqeojf7a'",
    );
    await queryRunner.query('ALTER TABLE `notification` DROP COLUMN `enabled`');
  }
}
