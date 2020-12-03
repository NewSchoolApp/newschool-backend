import {MigrationInterface, QueryRunner} from "typeorm";

export class CourseTaken1607015682401 implements MigrationInterface {
    name = 'CourseTaken1607015682401'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `course_taken` CHANGE `challenge` `challenge` varchar(255) NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `course_taken` CHANGE `challenge` `challenge` varchar(255) NOT NULL");
    }

}
