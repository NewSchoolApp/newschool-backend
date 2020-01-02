import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { CourseRepository } from '../repository';
import { Course } from '../entity';
import { CourseDTO, CourseUpdateDTO } from '../dto';
import { CourseMapper } from '../mapper';

@Injectable()
export class CourseService {

  constructor(
    private readonly repository: CourseRepository,
    private readonly mapper: CourseMapper,
  ) {
  }

  @Transactional()
  public async add(course: Course, file): Promise<Course> {

    const courseSameTitle: Course = await this.repository.findByTitle(course.title);
    if (courseSameTitle) {
      throw new ConflictException('Course with this title already exists');
    }

  
    // eslint-disable-next-line require-atomic-updates
    course.photoName = file.filename;

    return this.repository.save(course);
  }

  @Transactional()
  public async update(id: Course['id'], userUpdatedInfo: CourseUpdateDTO): Promise<Course> {
    const course: Course = await this.findById(id);
    return this.repository.save(this.mapper.toEntity({ ...course, ...userUpdatedInfo } as unknown as CourseDTO));
  }

  @Transactional()
  public async getAll(): Promise<Course[]> {
    return this.repository.find();
  }

  @Transactional()
  public async findById(id: Course['id']): Promise<Course> {
    const course: Course = await this.repository.findOne(id);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

    @Transactional()
    public async findBySlug(slug: string): Promise<Course> {
        const course: Course = await this.repository.findBySlug(slug);
        if (!course) {
            throw new NotFoundException('Course not found');
        }
        return course;
    }

    @Transactional()
    public async delete(id: Course['id']): Promise<void> {
        await this.repository.delete(id);
    }

    @Transactional()
    public async findByTitle(title: string): Promise<Course> {
        const course = await this.repository.findByTitle(title);
        if (!course) {
            throw new NotFoundException();
        }
        return course;
    }
}
