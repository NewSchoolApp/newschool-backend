import { MigrationInterface, QueryRunner } from 'typeorm';

export class Notification1601837424488 implements MigrationInterface {
  name = 'Notification1601837424488';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `notification` (`id` varchar(36) NOT NULL, `type` enum ('GAMEFICATION') NOT NULL, `content` json NOT NULL, `userId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      'ALTER TABLE `notification` ADD CONSTRAINT `FK_1ced25315eb974b73391fb1c81b` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `notification` DROP FOREIGN KEY `FK_1ced25315eb974b73391fb1c81b`',
    );
    await queryRunner.query('DROP TABLE `notification`');
  }
}
