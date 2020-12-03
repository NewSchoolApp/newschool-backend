import {MigrationInterface, QueryRunner} from "typeorm";

export class CourseTaken1607015652083 implements MigrationInterface {
    name = 'CourseTaken1607015652083'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `course_taken` ADD `challenge` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `client-credentials` CHANGE `refresh_token_validity` `refresh_token_validity` int NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `client-credentials` CHANGE `refresh_token_validity` `refresh_token_validity` int NOT NULL");
        await queryRunner.query("ALTER TABLE `course_taken` DROP COLUMN `challenge`");
    }

}
