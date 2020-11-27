import { MigrationInterface, QueryRunner } from 'typeorm';

export class CourseTaken1606328143397 implements MigrationInterface {
  name = 'CourseTaken1606328143397';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `FK_5f15a538c551f7c67675449a69d` ON `user_liked_comment`',
    );
    await queryRunner.query(
      'DROP INDEX `FK_adef5b991deaa567d0b04adc7dc` ON `course_taken`',
    );
    await queryRunner.query(
      'DROP INDEX `FK_04015db3c1af1bbacd5246ea887` ON `course_taken`',
    );
    await queryRunner.query(
      'DROP INDEX `FK_a0422a41a5800552fe6124d2530` ON `course_taken`',
    );
    await queryRunner.query(
      'DROP INDEX `FK_eaea2e6ca003557892d4b5b34d2` ON `course_taken`',
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
    await queryRunner.query(
      'CREATE INDEX `FK_eaea2e6ca003557892d4b5b34d2` ON `course_taken` (`current_test_id`)',
    );
    await queryRunner.query(
      'CREATE INDEX `FK_a0422a41a5800552fe6124d2530` ON `course_taken` (`current_part_id`)',
    );
    await queryRunner.query(
      'CREATE INDEX `FK_04015db3c1af1bbacd5246ea887` ON `course_taken` (`current_lesson_id`)',
    );
    await queryRunner.query(
      'CREATE INDEX `FK_adef5b991deaa567d0b04adc7dc` ON `course_taken` (`course_id`)',
    );
    await queryRunner.query(
      'CREATE INDEX `FK_5f15a538c551f7c67675449a69d` ON `user_liked_comment` (`commentId`)',
    );
  }
}
