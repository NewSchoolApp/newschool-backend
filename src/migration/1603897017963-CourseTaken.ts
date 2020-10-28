import { MigrationInterface, QueryRunner } from 'typeorm';

export class CourseTaken1603897017963 implements MigrationInterface {
  name = 'CourseTaken1603897017963';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `course_taken` ADD `rating` int NULL');
    await queryRunner.query(
      'ALTER TABLE `course_taken` ADD `feedback` varchar(255) NULL',
    );
    await queryRunner.query(
      "ALTER TABLE `badge` CHANGE `eventName` `eventName` enum ('CourseReward::TestOnFirstTake', 'CourseReward::CompleteCourse', 'UserReward::ShareCourse', 'UserReward::RateApp', 'UserReward::InviteUser', 'UserReward::CompleteRegistration', 'UserReward::CompleteCourse', 'CourseReward::CourseNPS') NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `achievement` CHANGE `eventName` `eventName` enum ('CourseReward::TestOnFirstTake', 'CourseReward::CompleteCourse', 'UserReward::ShareCourse', 'UserReward::RateApp', 'UserReward::InviteUser', 'UserReward::CompleteRegistration', 'UserReward::CompleteCourse', 'CourseReward::CourseNPS') NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `inviteKey` `inviteKey` varchar(255) NOT NULL DEFAULT '453rcjt5e22'",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `inviteKey` `inviteKey` varchar(255) NOT NULL DEFAULT 'tipr1zciqw'",
    );
    await queryRunner.query(
      "ALTER TABLE `achievement` CHANGE `eventName` `eventName` enum ('CourseReward::TestOnFirstTake', 'UserReward::ShareCourse', 'UserReward::RateApp', 'UserReward::InviteUser', 'UserReward::CompleteRegistration') NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `badge` CHANGE `eventName` `eventName` enum ('CourseReward::TestOnFirstTake', 'UserReward::ShareCourse', 'UserReward::RateApp', 'UserReward::InviteUser', 'UserReward::CompleteRegistration') NOT NULL",
    );
    await queryRunner.query(
      'ALTER TABLE `course_taken` DROP COLUMN `feedback`',
    );
    await queryRunner.query('ALTER TABLE `course_taken` DROP COLUMN `rating`');
  }
}
