import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1604225061535 implements MigrationInterface {
  name = 'User1604225061535';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` ADD `photoPath` varchar(255) NULL',
    );
    await queryRunner.query(
      "ALTER TABLE `badge` CHANGE `eventName` `eventName` enum ('CourseReward::TestOnFirstTake', 'CourseReward::CompleteCourse', 'UserReward::ShareCourse', 'UserReward::RateApp', 'UserReward::InviteUser', 'UserReward::CompleteRegistration', 'UserReward::CompleteCourse', 'CourseReward::CourseNPS', 'UserReward::ShareApp') NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `achievement` CHANGE `eventName` `eventName` enum ('CourseReward::TestOnFirstTake', 'CourseReward::CompleteCourse', 'UserReward::ShareCourse', 'UserReward::RateApp', 'UserReward::InviteUser', 'UserReward::CompleteRegistration', 'UserReward::CompleteCourse', 'CourseReward::CourseNPS', 'UserReward::ShareApp') NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `inviteKey` `inviteKey` varchar(255) NOT NULL DEFAULT 'j0ub9w327aa'",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `inviteKey` `inviteKey` varchar(255) NOT NULL DEFAULT 'pszqwvhhgi'",
    );
    await queryRunner.query(
      "ALTER TABLE `achievement` CHANGE `eventName` `eventName` enum ('CourseReward::TestOnFirstTake', 'CourseReward::CompleteCourse', 'UserReward::ShareCourse', 'UserReward::RateApp', 'UserReward::InviteUser', 'UserReward::CompleteRegistration', 'UserReward::CompleteCourse', 'CourseReward::CourseNPS') NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `badge` CHANGE `eventName` `eventName` enum ('CourseReward::TestOnFirstTake', 'CourseReward::CompleteCourse', 'UserReward::ShareCourse', 'UserReward::RateApp', 'UserReward::InviteUser', 'UserReward::CompleteRegistration', 'UserReward::CompleteCourse', 'CourseReward::CourseNPS') NOT NULL",
    );
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `photoPath`');
  }
}
