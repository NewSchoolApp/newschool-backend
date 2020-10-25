import { MigrationInterface, QueryRunner } from 'typeorm';

export class Badge1603135552585 implements MigrationInterface {
  name = 'Badge1603135552585';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `badge` CHANGE `eventName` `eventName` enum ('CourseReward::TestOnFirstTake', 'CourseReward::ShareCourse') NOT NULL",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `badge` CHANGE `eventName` `eventName` enum ('CourseReward::TestOnFirstTake') NOT NULL",
    );
  }
}
