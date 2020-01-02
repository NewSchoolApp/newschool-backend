import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CourseRepository } from '../repository';
import { Course } from '../entity';
import { CourseDTO, CourseUpdateDTO, NewCourseDTO } from '../dto';
import { CourseMapper } from '../mapper';

@Injectable()
export class CourseService {

  constructor(
    private readonly repository: CourseRepository,
    private readonly mapper: CourseMapper,
  ) {
  }

  public async add(course: NewCourseDTO): Promise<Course> {

    const courseSameTitle: Course = await this.repository.findByTitle(course.title);
    if (courseSameTitle) {
      throw new ConflictException('Course with this title already exists');
    }

    return this.repository.save(course);
  }

    public async update(id: Course['id'], courseUpdatedInfo: CourseUpdateDTO): Promise<Course> {
        const course: Course = await this.findById(id);
        return this.repository.save({ ...course, ...courseUpdatedInfo });
    }

    public async getAll(): Promise<Course[]> {
        return this.repository.find();
    }

    public async findById(id: Course['id']): Promise<Course> {
        const course: Course = await this.repository.findOne(id);
        if (!course) {
            throw new NotFoundException('Course not found');
        }
        return course;
    }

    public async findBySlug(slug: string): Promise<Course> {
        const course: Course = await this.repository.findBySlug(slug);
        if (!course) {
            throw new NotFoundException('Course not found');
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
