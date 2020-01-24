import { EntityRepository, Repository } from 'typeorm';
import { CourseTaken } from '../entity';
import { CertificateDTO } from '../dto';
import { CourseTakenStatusEnum } from '../enum';
import { User } from '../../UserModule/entity';

@EntityRepository(CourseTaken)
export class CourseTakenRepository extends Repository<CourseTaken> {
  async findByUserId(
    user: CourseTaken['user'],
  ): Promise<CourseTaken[] | undefined> {
    return this.find({ relations: ['user', 'course'], where: { user: user } });
  }

  async findCertificateByUserIdAndCourseId(
    user: CourseTaken['user'],
    course: CourseTaken['course'],
  ): Promise<CertificateDTO> {
    return this.findOne(
      { user, course, status: CourseTakenStatusEnum.COMPLETED },
      { relations: ['user', 'course'] },
    );
  }

  async findCertificatesByUserId(user: User['id']): Promise<CertificateDTO[]> {
    return this.find({
      relations: ['user', 'course'],
      where: { user: user, status: CourseTakenStatusEnum.COMPLETED },
    });
  }

  async findByCourseId(
    course: CourseTaken['course'],
  ): Promise<CourseTaken[] | undefined> {
    return this.find({ course });
  }

  async findByUserIdAndCourseId(
    user: CourseTaken['user'],
    course: CourseTaken['course'],
  ): Promise<CourseTaken | undefined> {
    return this.findOne({ user, course }, { relations: ['user', 'course'] });
  }
}
