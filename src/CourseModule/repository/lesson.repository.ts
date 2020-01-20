import { EntityRepository, Repository } from 'typeorm';
import { Lesson } from '../entity';

@EntityRepository(Lesson)
export class LessonRepository extends Repository<Lesson> {
  async findByTitle({ title, course }): Promise<Lesson | undefined> {
    return this.findByTitleAndCourseId({ title, course });
  }

  async findById({ id }): Promise<Lesson | undefined> {
    return this.findOne({ id });
  }

  async findByTitleAndCourseId({ title, course }): Promise<Lesson | undefined> {
    return this.findOne({ title, course });
  }
}
