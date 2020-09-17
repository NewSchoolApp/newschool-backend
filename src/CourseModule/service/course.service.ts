import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { CourseRepository } from '../repository/course.repository';
import { CourseMapper } from '../mapper/course.mapper';
import { CourseDTO } from '../dto/course.dto';
import { UserService } from '../../UserModule/service/user.service';
import { CourseUpdateDTO } from '../dto/course-update.dto';
import { NewCourseDTO } from '../dto/new-course.dto';
import { Course } from '../entity/course.entity';
import * as PubSub from 'pubsub-js';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class CourseService {
  constructor(
    private readonly repository: CourseRepository,
    private readonly mapper: CourseMapper,
    private readonly userService: UserService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  @Transactional()
  public async add(newCourse: NewCourseDTO, file): Promise<Course> {
    const course = this.mapper.toEntity(newCourse);
    course.photoName = file.filename;
    try {
      return await this.repository.save(course);
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Course with same title already exists');
      }
      throw new InternalServerErrorException(e.message);
    }
  }

  public async findByAuthorName(authorName: string): Promise<Course[]> {
    const courses: Course[] = await this.repository.findByAuthorName(
      authorName,
    );
    if (!courses.length) {
      throw new NotFoundException('No courses found for this author');
    }
    return courses;
  }

  @Transactional()
  public async update(
    id: Course['id'],
    userUpdatedInfo: CourseUpdateDTO,
  ): Promise<Course> {
    const course: Course = await this.findById(id);
    return this.repository.save(
      this.mapper.toEntity(({
        ...course,
        ...userUpdatedInfo,
      } as unknown) as CourseDTO),
    );
  }

  @Transactional()
  public async getAll(enabled?: boolean): Promise<Course[]> {
    PubSub.publish('CourseReward::TestOnFirstTake', {
      nome: 'teste',
      requestHeaders: this.request.headers,
    });
    if (enabled == null) return this.repository.find();
    return this.repository.find({ enabled: enabled });
  }

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
    const course: Course = await this.findById(id);
    await this.repository.save({ ...course, enabled: false });
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
