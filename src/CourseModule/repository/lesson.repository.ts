import { EntityRepository, Repository } from 'typeorm';
import { Course, Lesson } from '../entity';

@EntityRepository(Lesson)
export class LessonRepository extends Repository<Lesson> {
  async findById(id: string): Promise<Lesson | undefined> {
    return this.findOne({ id });
  }

  async findByIdWithCourse(id: string): Promise<Lesson | undefined> {
    return this.findOne({ id }, { relations: ['course'] });
  }

  async findByTitleAndCourse(
    title: string,
    course: Course,
  ): Promise<Lesson | undefined> {
    return this.findOne({ title, course });
  }
}
