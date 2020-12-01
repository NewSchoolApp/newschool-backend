import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientCredentials1606846492826 implements MigrationInterface {
  name = 'ClientCredentials1606846492826';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `client-credentials` CHANGE `refresh_token_validity` `refresh_token_validity` int NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `client-credentials` CHANGE `refresh_token_validity` `refresh_token_validity` int NOT NULL',
    );
  }
}
