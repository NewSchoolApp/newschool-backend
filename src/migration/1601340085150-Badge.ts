import { MigrationInterface, QueryRunner } from 'typeorm';

export class Badge1601340085150 implements MigrationInterface {
  name = 'Badge1601340085150';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `badge` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `version` int NOT NULL, `id` varchar(36) NOT NULL, `badgeName` varchar(255) NOT NULL, `badgeDescription` varchar(255) NOT NULL, `points` int NOT NULL, `slug` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `achievement` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `version` int NOT NULL, `id` varchar(36) NOT NULL, `rule` json NOT NULL, `completed` tinyint NOT NULL, `badgeId` varchar(36) NULL, `userId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `achievement` ADD CONSTRAINT `FK_3c1d510b9a26abd67e3b0ec1b33` FOREIGN KEY (`badgeId`) REFERENCES `badge`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `achievement` ADD CONSTRAINT `FK_61ea514b7a1ee99bc55c310bac9` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `achievement` DROP FOREIGN KEY `FK_61ea514b7a1ee99bc55c310bac9`',
    );
    await queryRunner.query(
      'ALTER TABLE `achievement` DROP FOREIGN KEY `FK_3c1d510b9a26abd67e3b0ec1b33`',
    );
    await queryRunner.query('DROP TABLE `achievement`');
    await queryRunner.query('DROP TABLE `badge`');
  }
}
