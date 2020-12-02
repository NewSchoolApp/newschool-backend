import { MigrationInterface, QueryRunner } from 'typeorm';

export class CourseTaken1606502741708 implements MigrationInterface {
  name = 'CourseTaken1606502741708';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `course_taken` DROP COLUMN `course_start_date`',
    );
    await queryRunner.query(
      'ALTER TABLE `course_taken` ADD `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)',
    );
    await queryRunner.query(
      'ALTER TABLE `course_taken` ADD `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)',
    );
    await queryRunner.query(
      'ALTER TABLE `course_taken` ADD `version` int NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `course_taken` DROP COLUMN `current_lesson_id`',
    );
    await queryRunner.query(
      'ALTER TABLE `course_taken` ADD `current_lesson_id` int NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `course_taken` DROP COLUMN `current_part_id`',
    );
    await queryRunner.query(
      'ALTER TABLE `course_taken` ADD `current_part_id` int NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `course_taken` DROP COLUMN `current_test_id`',
    );
    await queryRunner.query(
      'ALTER TABLE `course_taken` ADD `current_test_id` int NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user_liked_comment` DROP FOREIGN KEY `FK_5f15a538c551f7c67675449a69d`',
    );
    await queryRunner.query(
      'ALTER TABLE `user_liked_comment` DROP FOREIGN KEY `FK_314ff7eb948723c2e071a71ba9c`',
    );
    await queryRunner.query(
      'ALTER TABLE `course_taken` DROP COLUMN `current_test_id`',
    );
    await queryRunner.query(
      'ALTER TABLE `course_taken` ADD `current_test_id` varchar(36) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `course_taken` DROP COLUMN `current_part_id`',
    );
    await queryRunner.query(
      'ALTER TABLE `course_taken` ADD `current_part_id` varchar(36) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `course_taken` DROP COLUMN `current_lesson_id`',
    );
    await queryRunner.query(
      'ALTER TABLE `course_taken` ADD `current_lesson_id` varchar(36) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user_liked_comment` CHANGE `claps` `claps` int NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user_liked_comment` DROP PRIMARY KEY',
    );
    await queryRunner.query(
      'ALTER TABLE `user_liked_comment` ADD PRIMARY KEY (`userId`)',
    );
    await queryRunner.query(
      'ALTER TABLE `user_liked_comment` DROP COLUMN `commentId`',
    );
    await queryRunner.query(
      'ALTER TABLE `user_liked_comment` ADD `commentId` varchar(36) NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user_liked_comment` DROP PRIMARY KEY',
    );
    await queryRunner.query(
      'ALTER TABLE `user_liked_comment` ADD PRIMARY KEY (`commentId`, `userId`)',
    );
    await queryRunner.query(
      'ALTER TABLE `user_liked_comment` DROP PRIMARY KEY',
    );
    await queryRunner.query(
      'ALTER TABLE `user_liked_comment` ADD PRIMARY KEY (`commentId`)',
    );
    await queryRunner.query(
      'ALTER TABLE `user_liked_comment` DROP COLUMN `userId`',
    );
    await queryRunner.query(
      'ALTER TABLE `user_liked_comment` ADD `userId` varchar(36) NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user_liked_comment` DROP PRIMARY KEY',
    );
    await queryRunner.query(
      'ALTER TABLE `user_liked_comment` ADD PRIMARY KEY (`userId`, `commentId`)',
    );
    await queryRunner.query(
      'ALTER TABLE `user_liked_comment` DROP PRIMARY KEY',
    );
    await queryRunner.query('ALTER TABLE `course_taken` DROP COLUMN `version`');
    await queryRunner.query(
      'ALTER TABLE `course_taken` DROP COLUMN `updatedAt`',
    );
    await queryRunner.query(
      'ALTER TABLE `course_taken` DROP COLUMN `createdAt`',
    );
    await queryRunner.query(
      'ALTER TABLE `course_taken` ADD `course_start_date` datetime NOT NULL',
    );
  }
}
