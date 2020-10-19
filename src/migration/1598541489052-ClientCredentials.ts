import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientCredentials1598541489052 implements MigrationInterface {
  name = 'ClientCredentials1598541489052';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `client-credentials` CHANGE `name` `name` enum ('NEWSCHOOL@EXTERNAL', 'NEWSCHOOL@FRONT', 'NEWSCHOOL@ADMIN') NOT NULL",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `client-credentials` CHANGE `name` `name` enum ('NEWSCHOOL@EXTERNAL', 'NEWSCHOOL@FRONT') NOT NULL",
    );
  }
}
