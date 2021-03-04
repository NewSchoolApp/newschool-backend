import { MigrationInterface, QueryRunner } from 'typeorm';

export class NotificationType1614853279741 implements MigrationInterface {
  name = 'NotificationType1614853279741';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `notification` CHANGE `type` `type` enum ('GAMEFICATION', 'MARKETPLACE', 'OTHER') NOT NULL",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `notification` CHANGE `type` `type` enum (\'GAMEFICATION\', \'OTHER\') CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NOT NULL',
    );
  }
}
