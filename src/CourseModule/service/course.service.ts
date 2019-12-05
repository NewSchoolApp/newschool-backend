import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseRepository } from '../repository';
import { Course } from '../entity';
import { CourseNotFoundError } from '../../SecurityModule/exception';
@Injectable()
export class CourseService {

  constructor(
    private readonly repository: CourseRepository,
  ) {
  }

  public async getAll(): Promise<Course[]> {
    return this.repository.find();
  }

  public async findById(id: Course['id']): Promise<Course> {
    const Course: Course | undefined = await this.repository.findOne(id);
    if (!Course) {
      throw new NotFoundException();
    }
    return Course;
  }


  public async delete(id: Course['id']): Promise<void> {
    await this.repository.delete(id);
  }


  public async findByName(title: string): Promise<Course> {
    const Course = await this.repository.findByName(title);
    if (!Course) {
      throw new CourseNotFoundError();
    }
    return Course;
  }
}
