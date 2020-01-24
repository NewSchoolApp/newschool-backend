import { EntityRepository, Repository } from 'typeorm';
import { Course } from '../entity';

@EntityRepository(Course)
export class CourseRepository extends Repository<Course> {
  async findByTitle(title: string): Promise<Course | undefined> {
    return this.findOne({ title });
  }

  async findById(id: string): Promise<Course | undefined> {
    return this.findOne({ id });
  }

  async findBySlug(slug: string): Promise<Course | undefined> {
    return this.findOne({ slug });
  }

  async findByAuthorName(authorName: string): Promise<Course[]> {
    return this.find({ authorName });
  }
}
