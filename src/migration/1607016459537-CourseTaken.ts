import {MigrationInterface, QueryRunner} from "typeorm";

export class CourseTaken1607016459537 implements MigrationInterface {
    name = 'CourseTaken1607016459537'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `course_taken` CHANGE `challenge` `challenge` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `course_taken` CHANGE `challenge` `challenge` varchar(255) NOT NULL DEFAULT '0'");
    }

}
