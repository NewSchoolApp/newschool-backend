import { MigrationInterface, QueryRunner } from 'typeorm';

export class Notification1604673094513 implements MigrationInterface {
  name = 'Notification1604673094513';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `notification` CHANGE `seen` `seen` tinyint NOT NULL DEFAULT 0',
    );
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `inviteKey` `inviteKey` varchar(255) NOT NULL DEFAULT 'o5cc24cacfe'",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `inviteKey` `inviteKey` varchar(255) NOT NULL DEFAULT 'yci1iatvgp'",
    );
    await queryRunner.query(
      "ALTER TABLE `notification` CHANGE `seen` `seen` tinyint NOT NULL DEFAULT '1'",
    );
  }
}
