import { EntityRepository, Repository } from 'typeorm';
import { Part } from '../entity/part.entity';
import { Lesson } from '../entity/lesson.entity';

@EntityRepository(Part)
export class PartRepository extends Repository<Part> {
  async findById(id: string): Promise<Part | undefined> {
    return this.findOne({ id });
  }

  async findByTitleAndLesson(
    title: string,
    lesson: Lesson,
  ): Promise<Part | undefined> {
    return this.findOne({ title, lesson });
  }

  async findByIdWithLesson(id: string): Promise<Part | undefined> {
    return this.findOne({ id }, { relations: ['lesson'] });
  }
}
