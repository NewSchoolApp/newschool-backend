import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Audit } from '../../CommonsModule';
import { User } from '../../UserModule/entity';
import { Course, Lesson, Part, Test } from '../../CourseModule/entity';
import { Expose } from 'class-transformer';
import { CourseTakenStatusEnum } from '../enum';

@Entity()
@Check(
  'CHECK `status` IN (`' +
    CourseTakenStatusEnum.TAKEN +
    '`, `' +
    CourseTakenStatusEnum.COMPLETED +
    '`)',
)
@Index((relation: CourseTaken) => [relation.user, relation.course], {
  unique: true,
})
export class CourseTaken extends Audit {
  @ManyToOne<User>('User', (user: User) => user.coursesTaken, { primary: true })
  @JoinColumn({
    name: 'user_id',
  })
  @Expose()
  user: User;

  @ManyToOne<Course>('Course', (course: Course) => course.takenCourses, {
    primary: true,
  })
  @JoinColumn({
    name: 'course_id',
  })
  @Expose()
  course: Course;

  @Column({
    nullable: false,
    name: 'course_start_date',
  })
  @Expose()
  courseStartDate: Date;

  @Column({
    nullable: true,
    name: 'course_complete_date',
  })
  @Expose()
  courseCompleteDate: Date;

  @Column({
    nullable: false,
    name: 'status',
    type: 'enum',
    enum: CourseTakenStatusEnum,
    default: CourseTakenStatusEnum.TAKEN,
  })
  @Expose()
  status: CourseTakenStatusEnum;

  @Column({
    nullable: false,
    name: 'completion',
    default: 0,
  })
  @Expose()
  completion: number;

  @OneToMany<Lesson>('Lesson', (lesson: Lesson) => lesson.currentCoursesTaken)
  @Column({
    nullable: true,
    type: 'varchar',
    name: 'current_lesson_id',
  })
  @Expose()
  currentLesson: Lesson;

  @OneToMany<Part>('Part', (part: Part) => part.currentCoursesTaken)
  @Column({
    nullable: true,
    type: 'varchar',
    name: 'current_part_id',
  })
  @Expose()
  currentPart: Part;

  @OneToMany<Test>('Test', (test: Test) => test.currentCoursesTaken)
  @Column({
    nullable: true,
    type: 'varchar',
    name: 'current_test_id',
  })
  @Expose()
  currentTest: Test;
}
