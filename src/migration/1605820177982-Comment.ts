import { MigrationInterface, QueryRunner } from 'typeorm';

export class Comment1605820177982 implements MigrationInterface {
  name = 'Comment1605820177982';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `comment` ADD `userId` varchar(36) NULL',
    );
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `inviteKey` `inviteKey` varchar(255) NOT NULL DEFAULT 'l8ko99ihco9'",
    );
    await queryRunner.query(
      'ALTER TABLE `comment` ADD CONSTRAINT `FK_c0354a9a009d3bb45a08655ce3b` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `comment` DROP FOREIGN KEY `FK_c0354a9a009d3bb45a08655ce3b`',
    );
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `inviteKey` `inviteKey` varchar(255) NOT NULL DEFAULT 'rbm8e7f3ncq'",
    );
    await queryRunner.query('ALTER TABLE `comment` DROP COLUMN `userId`');
  }
}
