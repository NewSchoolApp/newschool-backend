import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { CourseRepository } from '../repository';
import { Course } from '../entity';
import { CourseDTO, CourseUpdateDTO, NewCourseDTO } from '../dto';
import { CourseMapper } from '../mapper';
import { User, UserService } from '../../UserModule';

@Injectable()
export class CourseService {

  constructor(
    private readonly repository: CourseRepository,
    private readonly mapper: CourseMapper,
    private readonly userService: UserService,
  ) {
  }

  @Transactional()
  public async add(newCourse: NewCourseDTO, file): Promise<Course> {

    const courseSameTitle: Course = await this.repository.findByTitle(newCourse.title);
    if (courseSameTitle) {
      throw new ConflictException('Course with this title already exists');
    }

    const course = this.mapper.toEntity(newCourse);
    const user: User = await this.userService.findById(newCourse.authorId);
    course.author = user;


    // eslint-disable-next-line require-atomic-updates
    course.photoName = file.filename;

    console.log(course);

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
