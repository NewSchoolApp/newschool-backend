import { MigrationInterface, QueryRunner } from 'typeorm';

export class Badge1604694308444 implements MigrationInterface {
  name = 'Badge1604694308444';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `badge` CHANGE `eventName` `eventName` enum ('CourseReward::TestOnFirstTake', 'CourseReward::CompleteCourse', 'UserReward::ShareCourse', 'UserReward::RateApp', 'UserReward::InviteUser', 'UserReward::CompleteRegistration', 'CourseReward::CourseNPS', 'UserReward::ShareApp', 'UserReward::TopMonth') NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `achievement` CHANGE `eventName` `eventName` enum ('CourseReward::TestOnFirstTake', 'CourseReward::CompleteCourse', 'UserReward::ShareCourse', 'UserReward::RateApp', 'UserReward::InviteUser', 'UserReward::CompleteRegistration', 'CourseReward::CourseNPS', 'UserReward::ShareApp', 'UserReward::TopMonth') NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `inviteKey` `inviteKey` varchar(255) NOT NULL DEFAULT 'm8zmk150gt'",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `inviteKey` `inviteKey` varchar(255) NOT NULL DEFAULT 'o5cc24cacfe'",
    );
    await queryRunner.query(
      "ALTER TABLE `achievement` CHANGE `eventName` `eventName` enum ('CourseReward::TestOnFirstTake', 'CourseReward::CompleteCourse', 'UserReward::ShareCourse', 'UserReward::RateApp', 'UserReward::InviteUser', 'UserReward::CompleteRegistration', 'CourseReward::CourseNPS', 'UserReward::ShareApp') NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `badge` CHANGE `eventName` `eventName` enum ('CourseReward::TestOnFirstTake', 'CourseReward::CompleteCourse', 'UserReward::ShareCourse', 'UserReward::RateApp', 'UserReward::InviteUser', 'UserReward::CompleteRegistration', 'CourseReward::CourseNPS', 'UserReward::ShareApp') NOT NULL",
    );
  }
}
