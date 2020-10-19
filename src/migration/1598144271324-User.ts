import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1598144271324 implements MigrationInterface {
  name = 'User1598144271324';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` ADD `enabled` tinyint NOT NULL DEFAULT 0',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `enabled`');
  }
}
