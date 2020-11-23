import { Check, Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Expose } from 'class-transformer';
import { CourseTakenStatusEnum } from '../enum/enum';
import { User } from '../../UserModule/entity/user.entity';
import { Part } from './part.entity';
import { Course } from './course.entity';
import { Lesson } from './lesson.entity';
import { Test } from './test.entity';
import { Audit } from '../../CommonsModule/entity/audit.entity';

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

  @Column({ name: 'course_id', primary: true })
  public courseId: string;

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

  @Column({
    nullable: true,
  })
  @Expose()
  rating?: number;

  @Column({
    nullable: true,
  })
  @Expose()
  feedback?: string;

  @ManyToOne<Lesson>(() => Lesson)
  @JoinColumn({
    name: 'current_lesson_id',
    referencedColumnName: 'id',
  })
  @Expose()
  currentLesson: Lesson;

  @Column({ name: 'current_lesson_id', nullable: true })
  public currentLessonId?: string;

  @ManyToOne<Part>(() => Part)
  @JoinColumn({
    name: 'current_part_id',
    referencedColumnName: 'id',
  })
  @Expose()
  currentPart: Part;

  @Column({ name: 'current_part_id', nullable: true })
  public currentPartId?: string;

  @ManyToOne<Test>(() => Test)
  @JoinColumn({
    name: 'current_test_id',
    referencedColumnName: 'id',
  })
  @Expose()
  currentTest: Test;

  @Column({ name: 'current_test_id', nullable: true })
  public currentTestId?: string;
}
