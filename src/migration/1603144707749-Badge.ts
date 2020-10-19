import { MigrationInterface, QueryRunner } from 'typeorm';

export class Badge1603144707749 implements MigrationInterface {
  name = 'Badge1603144707749';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `badge` CHANGE `eventName` `eventName` enum ('CourseReward::TestOnFirstTake', 'UserReward::ShareCourse', 'UserReward::RateApp') NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `achievement` CHANGE `eventName` `eventName` enum ('CourseReward::TestOnFirstTake', 'UserReward::ShareCourse', 'UserReward::RateApp') NOT NULL",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `achievement` CHANGE `eventName` `eventName` enum ('CourseReward::TestOnFirstTake', 'CourseReward::ShareCourse') NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `badge` CHANGE `eventName` `eventName` enum ('CourseReward::TestOnFirstTake', 'CourseReward::ShareCourse') NOT NULL",
    );
  }
}
