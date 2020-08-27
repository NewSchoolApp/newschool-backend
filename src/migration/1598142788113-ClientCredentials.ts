import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientCredentials1598142788113 implements MigrationInterface {
  name = 'ClientCredentials1598142788113';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `client-credentials` CHANGE `grantType` `authorized_grant_types` enum ('client_credentials', 'password', 'refresh_token') NOT NULL",
    );
    await queryRunner.query(
      'ALTER TABLE `client-credentials` DROP COLUMN `authorized_grant_types`',
    );
    await queryRunner.query(
      'ALTER TABLE `client-credentials` ADD `authorized_grant_types` varchar(255) NOT NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `client-credentials` DROP COLUMN `authorized_grant_types`',
    );
    await queryRunner.query(
      "ALTER TABLE `client-credentials` ADD `authorized_grant_types` enum ('client_credentials', 'password', 'refresh_token') NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `client-credentials` CHANGE `authorized_grant_types` `grantType` enum ('client_credentials', 'password', 'refresh_token') NOT NULL",
    );
  }
}
