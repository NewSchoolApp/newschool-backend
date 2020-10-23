import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1603488365996 implements MigrationInterface {
  name = 'User1603488365996';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `user` ADD `inviteKey` varchar(255) NOT NULL DEFAULT 'yw450ayase'",
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD `invitedByUserId` varchar(255) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD `invitedByKey` varchar(36) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `salt` `salt` varchar(255) NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD CONSTRAINT `FK_eadf0dd40c838a5f90e769abe27` FOREIGN KEY (`invitedByKey`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` DROP FOREIGN KEY `FK_eadf0dd40c838a5f90e769abe27`',
    );
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `salt` `salt` varchar(255) NOT NULL DEFAULT ''",
    );
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `invitedByKey`');
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `invitedByUserId`');
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `inviteKey`');
  }
}
