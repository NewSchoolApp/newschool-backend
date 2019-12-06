import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseRepository } from '../repository';
import { Course } from '../entity';
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
    const course: Course | undefined = await this.repository.findOne(id);
    if (!course) {
      throw new NotFoundException();
    }
    return course;
  }


  public async delete(id: Course['id']): Promise<void> {
    await this.repository.delete(id);
  }


  public async findByTitle(title: string): Promise<Course> {
    const course = await this.repository.findByTitle(title);
    if (!course) {
      throw new NotFoundException();
    }
    return course;
  }
}
