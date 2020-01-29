import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Audit } from '../../CommonsModule';
import { User } from '../../UserModule/entity/user.entity';
import { Course } from '../../CourseModule/entity/course.entity';
import { Expose } from 'class-transformer';
import { CourseTakenStatusEnum } from '../enum';
import { Lesson, Part, Test } from '../../CourseModule/entity';

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
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose()
  @ManyToOne<User>('User', (user: User) => user.coursesTaken)
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @Expose()
  @ManyToOne<Course>('Course', (course: Course) => course.takenCourses)
  @JoinColumn({
    name: 'course_id',
  })
  course: Course;

  @Expose()
  @Column({
    nullable: false,
    name: 'course_start_date',
  })
  courseStartDate: Date;

  @Expose()
  @Column({
    nullable: true,
    name: 'course_complete_date',
  })
  courseCompleteDate: Date;

  @Expose()
  @Column({
    nullable: false,
    name: 'status',
    type: 'enum',
    enum: CourseTakenStatusEnum,
    default: CourseTakenStatusEnum.TAKEN,
  })
  status: CourseTakenStatusEnum;

  @Expose()
  @Column({
    nullable: false,
    name: 'completition',
    default: 0,
  })
  completition: number;

  @OneToMany<Lesson>('Lesson', (lesson: Lesson) => lesson.currentCourseTakens)
  @Column({
    nullable: true,
    name: 'current_lesson_id',
  })
  @Expose()
  currentLesson: Lesson;

  @OneToMany<Part>('Part', (part: Part) => part.currentCourseTakens)
  @Column({
    nullable: true,
    name: 'current_part_id',
  })
  @Expose()
  currentPart: Part;

  @OneToMany<Test>('Test', (test: Test) => test.currentCourseTakens)
  @Column({
    nullable: true,
    name: 'current_test_id',
  })
  @Expose()
  currentTest: Test;
}
