import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientCredentials1598131164731 implements MigrationInterface {
  name = 'ClientCredentials1598131164731';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `client-credentials` ADD `grantType` enum ('client_credentials', 'password', 'refresh_token') NOT NULL",
    );
    await queryRunner.query(
      'ALTER TABLE `client-credentials` ADD `access_token_validity` int NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `client-credentials` ADD `refresh_token_validity` int NOT NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `client-credentials` DROP COLUMN `refresh_token_validity`',
    );
    await queryRunner.query(
      'ALTER TABLE `client-credentials` DROP COLUMN `access_token_validity`',
    );
    await queryRunner.query(
      'ALTER TABLE `client-credentials` DROP COLUMN `grantType`',
    );
  }
}
