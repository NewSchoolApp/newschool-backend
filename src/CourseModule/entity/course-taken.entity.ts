import { CourseTakenStatusEnum } from '../enum/course-taken-status.enum';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Expose } from 'class-transformer';
import { User } from '../../UserModule/entity/user.entity';
import { Audit } from '../../CommonsModule/entity/audit.entity';

@Entity('course_taken')
@Index(
  (courseTaken: CourseTaken) => [courseTaken.userId, courseTaken.courseId],
  {
    unique: true,
  },
)
export class CourseTaken extends Audit {
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

  @Column('varchar', { primary: true, name: 'course_id', length: 36 })
  courseId: number;

  @Column('int', { name: 'current_lesson_id', nullable: false })
  currentLessonId: number;

  @Column('int', { name: 'current_part_id', nullable: false })
  currentPartId: number;

  @Column('int', { name: 'current_test_id', nullable: true })
  currentTestId?: number;

  @Column('int', { name: 'rating', nullable: true })
  rating?: number;

  @Column('varchar', { name: 'feedback', nullable: true, length: 255 })
  feedback?: string;
}
