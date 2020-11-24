import { Part } from './part.entity';
import { Lesson } from './lesson.entity';
import { Course } from './course.entity';
import { CourseTakenStatusEnum } from './../enum/enum';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Expose } from 'class-transformer';
import { User } from '../../UserModule/entity/user.entity';
import { Test } from './test.entity';

@Entity('course_taken')
@Index(
  (courseTaken: CourseTaken) => [courseTaken.userId, courseTaken.courseId],
  {
    unique: true,
  },
)
export class CourseTaken {
  @Column('datetime', { name: 'course_start_date' })
  courseStartDate: Date;

  @Column('datetime', { name: 'course_complete_date', nullable: true })
  courseCompleteDate: Date | null;

  @Column('enum', {
    name: 'status',
    enum: CourseTakenStatusEnum,
    default: CourseTakenStatusEnum.TAKEN,
  })
  status: CourseTakenStatusEnum;

  @Column({ name: 'completion', default: 0 })
  completion: number;

  @ManyToOne<User>('User')
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  @Expose()
  user: User;

  @Column('varchar', { primary: true, name: 'user_id', length: 36 })
  userId: string;

  @ManyToOne<Course>('Course')
  @JoinColumn({
    name: 'course_id',
    referencedColumnName: 'id',
  })
  @Expose()
  course: Course;

  @Column('varchar', { primary: true, name: 'course_id', length: 36 })
  courseId: string;

  @ManyToOne<Lesson>('Lesson')
  @JoinColumn({
    name: 'current_lesson_id',
    referencedColumnName: 'id',
  })
  @Expose()
  currentLesson: Lesson;

  @Column('varchar', { name: 'current_lesson_id', nullable: true, length: 36 })
  currentLessonId: string | null;

  @ManyToOne<Part>('Part')
  @JoinColumn({
    name: 'current_part_id',
    referencedColumnName: 'id',
  })
  @Expose()
  currentPart: Part;

  @Column('varchar', { name: 'current_part_id', nullable: true, length: 36 })
  currentPartId: string | null;

  @ManyToOne<Test>('Test')
  @JoinColumn({
    name: 'current_test_id',
    referencedColumnName: 'id',
  })
  @Expose()
  currentTest: Test;

  @Column('varchar', { name: 'current_test_id', nullable: true, length: 36 })
  currentTestId: string | null;

  @Column('int', { name: 'rating', nullable: true })
  rating: number | null;

  @Column('varchar', { name: 'feedback', nullable: true, length: 255 })
  feedback: string | null;
}
