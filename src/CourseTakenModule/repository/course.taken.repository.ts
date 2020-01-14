import { EntityRepository, Repository } from 'typeorm';
import { CourseTaken } from '../entity';

@EntityRepository(CourseTaken)
export class CourseTakenRepository extends Repository<CourseTaken> {

  async findByUserId(user: string): Promise<CourseTaken[] | undefined> {
    return this.find({ user });
  }

  async findByCourseId(course: string): Promise<CourseTaken[] | undefined> {
    return this.find({ course });
  }

  async findByUserIdAndCourseId(user: string, course: string): Promise<CourseTaken | undefined> {
    return this.findOne({ user, course });
  }
}
