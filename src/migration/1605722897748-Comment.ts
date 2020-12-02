import { MigrationInterface, QueryRunner } from 'typeorm';

export class Comment1605722897748 implements MigrationInterface {
  name = 'Comment1605722897748';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `comment` (`id` varchar(36) NOT NULL, `text` varchar(255) NOT NULL, `partId` varchar(36) NULL, `parentCommentId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `comment` ADD CONSTRAINT `FK_b30ecea262b1632623e4e2d31d3` FOREIGN KEY (`partId`) REFERENCES `part`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `comment` ADD CONSTRAINT `FK_73aac6035a70c5f0313c939f237` FOREIGN KEY (`parentCommentId`) REFERENCES `comment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );

    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `inviteKey` `inviteKey` varchar(255) NOT NULL DEFAULT 'rbm8e7f3ncq'",
    );

    await queryRunner.query(
      'CREATE TABLE `user_liked_comment` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `version` int NOT NULL, `userId` varchar(36) NOT NULL, `commentId` varchar(36) NOT NULL, PRIMARY KEY (`userId`, `commentId`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `user_has_comment` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `version` int NOT NULL, `userId` varchar(36) NOT NULL, `commentId` varchar(36) NOT NULL, PRIMARY KEY (`userId`, `commentId`)) ENGINE=InnoDB',
    );

    await queryRunner.query(
      'ALTER TABLE `user_liked_comment` ADD CONSTRAINT `FK_314ff7eb948723c2e071a71ba9c` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `user_liked_comment` ADD CONSTRAINT `FK_5f15a538c551f7c67675449a69d` FOREIGN KEY (`commentId`) REFERENCES `comment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `user_has_comment` ADD CONSTRAINT `FK_8de4a27ed08356a6d625329167f` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `user_has_comment` ADD CONSTRAINT `FK_42cad6151a3c2832d600a83357f` FOREIGN KEY (`commentId`) REFERENCES `comment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `comment` DROP FOREIGN KEY `FK_73aac6035a70c5f0313c939f237`',
    );
    await queryRunner.query(
      'ALTER TABLE `comment` DROP FOREIGN KEY `FK_b30ecea262b1632623e4e2d31d3`',
    );
    await queryRunner.query(
      'ALTER TABLE `user_has_comment` DROP FOREIGN KEY `FK_42cad6151a3c2832d600a83357f`',
    );
    await queryRunner.query(
      'ALTER TABLE `user_has_comment` DROP FOREIGN KEY `FK_8de4a27ed08356a6d625329167f`',
    );
    await queryRunner.query(
      'ALTER TABLE `user_liked_comment` DROP FOREIGN KEY `FK_5f15a538c551f7c67675449a69d`',
    );
    await queryRunner.query(
      'ALTER TABLE `user_liked_comment` DROP FOREIGN KEY `FK_314ff7eb948723c2e071a71ba9c`',
    );
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `inviteKey` `inviteKey` varchar(255) NOT NULL DEFAULT 'lq1dm8pr3w'",
    );
    await queryRunner.query('DROP TABLE `comment`');
    await queryRunner.query('DROP TABLE `user_has_comment`');
    await queryRunner.query('DROP TABLE `user_liked_comment`');
  }
}
