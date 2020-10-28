import {MigrationInterface, QueryRunner} from "typeorm";

export class User1603903749462 implements MigrationInterface {
    name = 'User1603903749462'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` ADD `city` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `user` ADD `state` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `user` CHANGE `inviteKey` `inviteKey` varchar(255) NOT NULL DEFAULT 'm1zrtpb080s'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` CHANGE `inviteKey` `inviteKey` varchar(255) NOT NULL DEFAULT '453rcjt5e22'");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `state`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `city`");
    }

}
