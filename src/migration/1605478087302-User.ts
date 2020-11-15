import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1605478087302 implements MigrationInterface {
  name = 'User1605478087302';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `institutionName` `institutionName` varchar(255) NOT NULL',
    );
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `inviteKey` `inviteKey` varchar(255) NOT NULL DEFAULT 'e32pgr4sm2q'",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `inviteKey` `inviteKey` varchar(255) NOT NULL DEFAULT 'm8zmk150gt'",
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `institutionName` `institutionName` varchar(255) NULL',
    );
  }
}
