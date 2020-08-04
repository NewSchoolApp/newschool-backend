import { EntityRepository, Repository } from 'typeorm';
import { CourseTakenStatusEnum } from '../enum/enum';
import { User } from '../../UserModule/entity/user.entity';
import { CourseTaken } from '../entity/course.taken.entity';
import { CertificateDTO } from '../dto/certificate.dto';
import { MoreThanOrEqual } from 'typeorm/index';

@EntityRepository(CourseTaken)
export class CourseTakenRepository extends Repository<CourseTaken> {
  public async findByUserId(
    user: CourseTaken['user'],
  ): Promise<CourseTaken[] | undefined> {
    return this.find({ relations: ['user', 'course'], where: { user: user } });
  }

  public async findByUser(
    user: CourseTaken['user'],
  ): Promise<CourseTaken[] | undefined> {
    return this.find({ relations: ['user', 'course'], where: { user } });
  }

  public async getActiveUsersQuantity(): Promise<number> {
    // eslint-disable-next-line camelcase
    const activeUsers: { user_id: number }[] = await this.createQueryBuilder(
      'coursetaken',
    )
      .where('coursetaken.completion', MoreThanOrEqual<number>(30))
      .select('DISTINCT coursetaken.user', 'user')
      .orderBy('user')
      .getRawMany();
    return activeUsers.length;
  }

  public async getCertificateQuantity(): Promise<number> {
    return this.count({ where: { status: CourseTakenStatusEnum.COMPLETED } });
  }

  public async findByUserAndCourseWithAllRelations(
    user: CourseTaken['user'],
    course: CourseTaken['course'],
  ): Promise<CourseTaken> {
    return this.findOne(
      { user, course },
      {
        relations: [
          'user',
          'course',
          'currentLesson',
          'currentPart',
          'currentTest',
        ],
      },
    );
  }

  public async findCertificateByUserAndCourse(
    user: CourseTaken['user'],
    course: CourseTaken['course'],
  ): Promise<CertificateDTO> {
    return this.findOne(
      { user, course, status: CourseTakenStatusEnum.COMPLETED },
      { relations: ['user', 'course'] },
    );
  }

  public async findCertificatesByUserId(
    user: User['id'],
  ): Promise<CertificateDTO[]> {
    return this.find({
      relations: ['user', 'course'],
      where: { user: user, status: CourseTakenStatusEnum.COMPLETED },
    });
  }

  public async findByCourseId(
    course: CourseTaken['course'],
  ): Promise<CourseTaken[] | undefined> {
    return this.find({ course });
  }

  public async findByCourse(
    course: CourseTaken['course'],
  ): Promise<CourseTaken[] | undefined> {
    return this.find({ course });
  }

  public async findByUserIdAndCourseId(
    user: CourseTaken['user'],
    course: CourseTaken['course'],
  ): Promise<CourseTaken | undefined> {
    return this.findOne({ user, course }, { relations: ['user', 'course'] });
  }

  public async getUsersWithTakenCourses(): Promise<number> {
    return this.createQueryBuilder('coursetaken')
      .where('coursetaken.status = :courseTakenStatus', {
        courseTakenStatus: CourseTakenStatusEnum.TAKEN,
      })
      .groupBy('coursetaken.user')
      .getCount();
  }

  public async getUsersWithCompletedCourses(): Promise<number> {
    return this.createQueryBuilder('coursetaken')
      .where('coursetaken.status = :courseTakenStatus', {
        courseTakenStatus: CourseTakenStatusEnum.COMPLETED,
      })
      .groupBy('coursetaken.user')
      .getCount();
  }

  public async getUsersWithCompletedAndTakenCourses(): Promise<number> {
    return this.createQueryBuilder('coursetaken')
      .groupBy('coursetaken.user')
      .getCount();
  }
}
