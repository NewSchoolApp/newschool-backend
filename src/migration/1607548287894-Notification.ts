import { MigrationInterface, QueryRunner } from 'typeorm';

export class Notification1607548287894 implements MigrationInterface {
  name = 'Notification1607548287894';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `notification` ADD `important` tinyint NOT NULL DEFAULT 0',
    );
    await queryRunner.query(
      "ALTER TABLE `notification` CHANGE `type` `type` enum ('GAMEFICATION', 'OTHER') NOT NULL",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `notification` CHANGE `type` `type` enum ('GAMEFICATION') NOT NULL",
    );
    await queryRunner.query(
      'ALTER TABLE `notification` DROP COLUMN `important`',
    );
  }
}
