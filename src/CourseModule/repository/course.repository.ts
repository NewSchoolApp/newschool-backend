import { EntityRepository, Repository } from 'typeorm';
import { Course } from '../entity';

@EntityRepository(Course)
export class CourseRepository extends Repository<Course> {

  async findByName(title: string): Promise<Course | undefined> {
    return this.findOne({ title });
  }
}
