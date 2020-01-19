import { EntityRepository, Repository } from 'typeorm';
import { CourseTaken } from '../entity';

@EntityRepository(CourseTaken)
export class CourseTakenRepository extends Repository<CourseTaken> {

  async findByUserId(user: CourseTaken['user']): Promise<CourseTaken[] | undefined> {
    return this.find({ user });
  }

  async findByCourseId(course: CourseTaken['course']): Promise<CourseTaken[] | undefined> {
    return this.find({ course });
  }

  async findByUserIdAndCourseId(user: CourseTaken['user'], course: CourseTaken['course']): Promise<CourseTaken | undefined> {
    return this.findOne({ user, course });
  }
}
