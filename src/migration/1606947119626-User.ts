import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1606947119626 implements MigrationInterface {
  name = 'User1606947119626';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `achievement` DROP COLUMN `points`');
    await queryRunner.query('ALTER TABLE `user` ADD `cep` varchar(255) NULL');
    await queryRunner.query(
      'ALTER TABLE `user` ADD `complement` varchar(255) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD `houseNumber` varchar(255) NULL',
    );
    await queryRunner.query('ALTER TABLE `user` ADD `phone` varchar(255) NULL');
    await queryRunner.query(
      'ALTER TABLE `client-credentials` CHANGE `refresh_token_validity` `refresh_token_validity` int NOT NULL',
    );
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `gender` `gender` enum ('MALE', 'FEMALE', 'NOT BINARY', 'NOT DEFINED') NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `schooling` `schooling` enum ('ENSINO_FUNDAMENTAL_INCOMPLETO', 'ENSINO_FUNDAMENTAL_CURSANDO', 'ENSINO_FUNDAMENTAL_COMPLETO', 'ENSINO_MEDIO_INCOMPLETO', 'ENSINO_MEDIO_CURSANDO', 'ENSINO_MEDIO_COMPLETO', 'TERCEIRO_ANO', 'FACULDADE_INCOMPLETO', 'FACULDADE_CURSANDO', 'FACULDADE_COMPLETO') NULL",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `schooling` `schooling` enum ('ENSINO_FUNDAMENTAL_COMPLETO', 'ENSINO_FUNDAMENTAL_INCOMPLETO', 'ENSINO_FUNDAMENTAL_CURSANDO', 'ENSINO_MEDIO_COMPLETO', 'ENSINO_MEDIO_INCOMPLETO', 'ENSINO_MEDIO_CURSANDO', 'FACULDADE_COMPLETO', 'FACULDADE_INCOMPLETO', 'FACULDADE_CURSANDO') NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `gender` `gender` enum ('MALE', 'FEMALE', 'NOT DEFINED') NULL",
    );
    await queryRunner.query(
      'ALTER TABLE `client-credentials` CHANGE `refresh_token_validity` `refresh_token_validity` int NULL',
    );
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `phone`');
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `houseNumber`');
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `complement`');
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `cep`');
    await queryRunner.query(
      'ALTER TABLE `achievement` ADD `points` int NOT NULL',
    );
  }
}
