import { MigrationInterface, QueryRunner } from 'typeorm';

export class Badge1603640022693 implements MigrationInterface {
  name = 'Badge1603640022693';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `badge` CHANGE `eventName` `eventName` enum ('CourseReward::TestOnFirstTake', 'UserReward::ShareCourse', 'UserReward::RateApp', 'UserReward::InviteUser', 'UserReward::CompleteRegistration') NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `achievement` CHANGE `eventName` `eventName` enum ('CourseReward::TestOnFirstTake', 'UserReward::ShareCourse', 'UserReward::RateApp', 'UserReward::InviteUser', 'UserReward::CompleteRegistration') NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `inviteKey` `inviteKey` varchar(255) NOT NULL DEFAULT 'tipr1zciqw'",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `inviteKey` `inviteKey` varchar(255) NOT NULL DEFAULT 'li495l4ul2'",
    );
    await queryRunner.query(
      "ALTER TABLE `achievement` CHANGE `eventName` `eventName` enum ('CourseReward::TestOnFirstTake', 'UserReward::ShareCourse', 'UserReward::RateApp', 'UserReward::InviteUser') NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `badge` CHANGE `eventName` `eventName` enum ('CourseReward::TestOnFirstTake', 'UserReward::ShareCourse', 'UserReward::RateApp', 'UserReward::InviteUser') NOT NULL",
    );
  }
}
