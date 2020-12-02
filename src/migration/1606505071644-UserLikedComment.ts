import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserLikedComment1606505071644 implements MigrationInterface {
  name = 'UserLikedComment1606505071644';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `user_liked_comment` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `version` int NOT NULL, `userId` varchar(255) NOT NULL, `commentId` varchar(255) NOT NULL, `claps` int NOT NULL DEFAULT '0', PRIMARY KEY (`userId`, `commentId`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      'ALTER TABLE `user_liked_comment` ADD CONSTRAINT `FK_314ff7eb948723c2e071a71ba9c` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `user_liked_comment` ADD CONSTRAINT `FK_5f15a538c551f7c67675449a69d` FOREIGN KEY (`commentId`) REFERENCES `comment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user_liked_comment` DROP FOREIGN KEY `FK_5f15a538c551f7c67675449a69d`',
    );
    await queryRunner.query(
      'ALTER TABLE `user_liked_comment` DROP FOREIGN KEY `FK_314ff7eb948723c2e071a71ba9c`',
    );
    await queryRunner.query('DROP TABLE `user_liked_comment`');
  }
}
