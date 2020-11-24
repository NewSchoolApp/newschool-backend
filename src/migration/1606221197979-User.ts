import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1606221197979 implements MigrationInterface {
  name = 'User1606221197979';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `inviteKey` `inviteKey` varchar(255) NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD UNIQUE INDEX `IDX_6ff2d720203660fc725d0125ac` (`inviteKey`)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` DROP INDEX `IDX_6ff2d720203660fc725d0125ac`',
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `inviteKey` `inviteKey` varchar(255) NOT NULL',
    );
  }
}
