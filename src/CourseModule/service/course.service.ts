import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { CourseRepository } from '../repository';
import { Course } from '../entity';
import { CourseDTO, CourseUpdateDTO, NewCourseDTO } from '../dto';
import { CourseMapper } from '../mapper';

@Injectable()
export class CourseService {

    constructor(
        private readonly repository: CourseRepository,
        private readonly mapper: CourseMapper,
        private readonly entityManager: EntityManager,
    ) {
    }

    @Transactional()
    public async add(course: NewCourseDTO): Promise<Course> {

        const courseSameTitle: Course = await this.entityManager
          .getCustomRepository(CourseRepository)
          .findByTitle(course.title);
        if (courseSameTitle) {
            throw new ConflictException('Course with this title already exists');
        }

        return this.entityManager.getCustomRepository(CourseRepository).save(course);
    }

    @Transactional()
    public async update(id: Course['id'], userUpdatedInfo: CourseUpdateDTO): Promise<Course> {
        const course: Course = await this.findById(id);
        return this.entityManager
          .getCustomRepository(CourseRepository)
          .save(this.mapper.toEntity({ ...course, ...userUpdatedInfo } as unknown as CourseDTO));
    }

    @Transactional()
    public async getAll(): Promise<Course[]> {
        return this.entityManager.getCustomRepository(CourseRepository).find();
    }

    @Transactional()
    public async findById(id: Course['id']): Promise<Course> {
        const course: Course = await this.entityManager.getCustomRepository(CourseRepository).findOne(id);
        if (!course) {
            throw new NotFoundException('Course not found');
        }
        return course;
    }

    @Transactional()
    public async findBySlug(slug: string): Promise<Course> {
        const course: Course = await this.entityManager
        .getCustomRepository(CourseRepository)
        .findBySlug(slug);
        if (!course) {
            throw new NotFoundException('Course not found');
        }
            return course;
    }

    @Transactional()
    public async delete(id: Course['id']): Promise<void> {
        await this.entityManager.getCustomRepository(CourseRepository).delete(id);
    }

    @Transactional()
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
