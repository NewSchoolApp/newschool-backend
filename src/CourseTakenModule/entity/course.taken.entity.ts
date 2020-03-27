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
    referencedColumnName: 'id',
  })
  @Expose()
  user: User;

  @ManyToOne<Course>('Course', (course: Course) => course.takenCourses, {
    primary: true,
  })
  @JoinColumn({
    name: 'course_id',
    referencedColumnName: 'id',
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

  @ManyToOne<Lesson>('Lesson', (lesson: Lesson) => lesson.currentCoursesTaken, {
    nullable: true,
  })
  @JoinColumn({
    name: 'current_lesson_id',
    referencedColumnName: 'id',
  })
  @Expose()
  currentLesson: Lesson;

  @ManyToOne<Part>('Part', (part: Part) => part.currentCoursesTaken, {
    nullable: true,
  })
  @JoinColumn({
    name: 'current_part_id',
    referencedColumnName: 'id',
  })
  @Expose()
  currentPart: Part;

  @ManyToOne<Test>('Test', (test: Test) => test.currentCoursesTaken, {
    nullable: true,
  })
  @JoinColumn({
    name: 'current_test_id',
    referencedColumnName: 'id',
  })
  @Expose()
  currentTest: Test;
}
