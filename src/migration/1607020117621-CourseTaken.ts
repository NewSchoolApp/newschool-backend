import {MigrationInterface, QueryRunner} from "typeorm";

export class CourseTaken1607020117621 implements MigrationInterface {
    name = 'CourseTaken1607020117621'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `course_taken` CHANGE `challenge` `challenge` varchar(255) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `course_taken` CHANGE `challenge` `challenge` varchar(255) NOT NULL");
    }

}
