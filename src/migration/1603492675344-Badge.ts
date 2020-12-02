import { MigrationInterface, QueryRunner } from 'typeorm';

export class Badge1603492675344 implements MigrationInterface {
  name = 'Badge1603492675344';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `badge` CHANGE `eventName` `eventName` enum ('CourseReward::TestOnFirstTake', 'UserReward::ShareCourse', 'UserReward::RateApp', 'UserReward::InviteUser') NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `achievement` CHANGE `eventName` `eventName` enum ('CourseReward::TestOnFirstTake', 'UserReward::ShareCourse', 'UserReward::RateApp', 'UserReward::InviteUser') NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `inviteKey` `inviteKey` varchar(255) NOT NULL DEFAULT 'li495l4ul2'",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `inviteKey` `inviteKey` varchar(255) NOT NULL DEFAULT 'eb62g1jma1'",
    );
    await queryRunner.query(
      "ALTER TABLE `achievement` CHANGE `eventName` `eventName` enum ('CourseReward::TestOnFirstTake', 'UserReward::ShareCourse', 'UserReward::RateApp') NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `badge` CHANGE `eventName` `eventName` enum ('CourseReward::TestOnFirstTake', 'UserReward::ShareCourse', 'UserReward::RateApp') NOT NULL",
    );
  }
}
