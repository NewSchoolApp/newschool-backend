import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1600564790819 implements MigrationInterface {
  name = 'User1600564790819';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `user` ADD `profile` enum ('STUDENT', 'EX_STUDENT', 'UNIVERSITY', 'FATHER', 'INVESTOR', 'OTHERS') NOT NULL",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `profile`');
  }
}
