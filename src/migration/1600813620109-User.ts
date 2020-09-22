import {MigrationInterface, QueryRunner} from "typeorm";

export class User1600813620109 implements MigrationInterface {
    name = 'User1600813620109'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` CHANGE `institutionName` `institutionName` varchar(255) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` CHANGE `institutionName` `institutionName` varchar(255) NOT NULL");
    }

}
