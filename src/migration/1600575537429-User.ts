import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1600575537429 implements MigrationInterface {
  name = 'User1600575537429';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `nickname` `nickname` varchar(255) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `birthday` `birthday` datetime NULL',
    );
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `gender` `gender` enum ('MALE', 'FEMALE', 'NOT DEFINED') NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `schooling` `schooling` enum ('ENSINO_FUNDAMENTAL_COMPLETO', 'ENSINO_FUNDAMENTAL_INCOMPLETO', 'ENSINO_FUNDAMENTAL_CURSANDO', 'ENSINO_MEDIO_COMPLETO', 'ENSINO_MEDIO_INCOMPLETO', 'ENSINO_MEDIO_CURSANDO', 'FACULDADE_COMPLETO', 'FACULDADE_INCOMPLETO', 'FACULDADE_CURSANDO') NULL",
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `profession` `profession` varchar(255) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `address` `address` varchar(255) NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `address` `address` varchar(255) NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `profession` `profession` varchar(255) NOT NULL',
    );
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `schooling` `schooling` enum ('ENSINO_FUNDAMENTAL_COMPLETO', 'ENSINO_FUNDAMENTAL_INCOMPLETO', 'ENSINO_FUNDAMENTAL_CURSANDO', 'ENSINO_MEDIO_COMPLETO', 'ENSINO_MEDIO_INCOMPLETO', 'ENSINO_MEDIO_CURSANDO', 'FACULDADE_COMPLETO', 'FACULDADE_INCOMPLETO', 'FACULDADE_CURSANDO') NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `gender` `gender` enum ('MALE', 'FEMALE', 'NOT DEFINED') NOT NULL",
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `birthday` `birthday` datetime NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `nickname` `nickname` varchar(255) NOT NULL',
    );
  }
}
