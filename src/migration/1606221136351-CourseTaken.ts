import { MigrationInterface, QueryRunner } from 'typeorm';

export class CourseTaken1606221136351 implements MigrationInterface {
  name = 'CourseTaken1606221136351';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_87dfc74a20ae1ae8c28fba7901` ON `course_taken` (`user_id`, `course_id`)',
    );
    await queryRunner.query(
      'ALTER TABLE `comment` ADD CONSTRAINT `FK_c0354a9a009d3bb45a08655ce3b` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `comment` DROP FOREIGN KEY `FK_c0354a9a009d3bb45a08655ce3b`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_87dfc74a20ae1ae8c28fba7901` ON `course_taken`',
    );
  }
}
