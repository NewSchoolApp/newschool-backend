import { Audit } from '../../CommonsModule';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Course } from './course.entity';
import { Part } from './part.entity';
import { CourseTaken } from '../../CourseTakenModule/entity';

@Unique(['sequenceNumber', 'course'])
@Entity()
export class Lesson extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'title',
  })
  title: string;

  @Column({
    name: 'description',
  })
  description: string;

  @Column({
    name: 'seq_num',
  })
  sequenceNumber: number;

  @ManyToOne<Course>('Course', (course: Course) => course.lessons)
  @JoinColumn({
    name: 'course_id',
  })
  course: Course;

  @OneToMany<Part>('Part', (part: Part) => part.lesson)
  parts: Part[];

  @OneToMany<CourseTaken>(
    'CourseTaken',
    (courseTaken: CourseTaken) => courseTaken.currentLesson,
  )
  currentCoursesTaken: CourseTaken[];
}
