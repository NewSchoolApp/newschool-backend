import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CourseRepository } from '../repository';
import { Course } from '../entity';
import { CourseDTO, CourseUpdateDTO } from '../dto';
import { CourseMapper } from '../mapper';

@Injectable()
export class CourseService {

  constructor(
    private readonly repository: CourseRepository,
    private readonly mapper: CourseMapper,
    private readonly entityManager: EntityManager,
  ) {
  }

  public async add(course: Course): Promise<Course> {

    const courseSameTitle: Course = await this.entityManager
      .getCustomRepository(CourseRepository)
      .findByTitle(course.title);
    if (courseSameTitle) {
      throw new ConflictException('Course with this title already exists');
    }

    return this.entityManager.getCustomRepository(CourseRepository).save(course);
  }

  public async update(id: Course['id'], userUpdatedInfo: CourseUpdateDTO): Promise<Course> {
    const course: Course = await this.findById(id);
    return this.entityManager
      .getCustomRepository(CourseRepository)
      .save(this.mapper.toEntity({ ...course, ...userUpdatedInfo } as unknown as CourseDTO));
  }

  public async getAll(): Promise<Course[]> {
    return this.entityManager.getCustomRepository(CourseRepository).find();
  }

  public async findById(id: Course['id']): Promise<Course> {
    const course: Course = await this.entityManager.getCustomRepository(CourseRepository).findOne(id);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  public async findBySlug(slug: string): Promise<Course> {
    const course: Course = await this.entityManager
      .getCustomRepository(CourseRepository)
      .findBySlug(slug);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  public async delete(id: Course['id']): Promise<void> {
    await this.entityManager.getCustomRepository(CourseRepository).delete(id);
  }

  public async findByTitle(title: string): Promise<Course> {
    const course = await this.entityManager
      .getCustomRepository(CourseRepository)
      .findByTitle(title);
    if (!course) {
      throw new NotFoundException();
    }
    return course;
  }
}
