import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1603489957766 implements MigrationInterface {
  name = 'User1603489957766';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `inviteKey` `inviteKey` varchar(255) NOT NULL DEFAULT 'eb62g1jma1'",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `inviteKey` `inviteKey` varchar(255) NOT NULL DEFAULT 'zrndxbksymd'",
    );
  }
}
