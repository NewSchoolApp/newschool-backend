import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Lesson } from './lesson.entity';
import { Test } from './test.entity';
import { Expose } from 'class-transformer';
import { CourseTaken } from './course.taken.entity';
import { Audit } from '../../CommonsModule/entity/audit.entity';
import { Comment } from './comment.entity';

@Unique(['sequenceNumber', 'lesson'])
@Entity()
export class Part extends Audit {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column({
    name: 'title',
  })
  @Expose()
  title: string;

  @Column({
    name: 'description',
  })
  @Expose()
  description: string;

  @Column({
    nullable: true,
    name: 'vimeo_url',
  })
  @Expose()
  vimeoUrl?: string;

  @Column({
    nullable: true,
    name: 'youtube_url',
  })
  @Expose()
  youtubeUrl?: string;

  @ManyToOne<Lesson>('Lesson', (lesson: Lesson) => lesson.parts)
  @JoinColumn({
    name: 'lesson_id',
  })
  @Expose()
  lesson: Lesson;

  @Column({
    name: 'seq_num',
  })
  @Expose()
  sequenceNumber: number;

  @OneToMany<Test>('Test', (test: Test) => test.part)
  tests: Test[];

  @OneToMany<CourseTaken>(
    'CourseTaken',
    (courseTaken: CourseTaken) => courseTaken.currentPart,
  )
  currentCoursesTaken: CourseTaken[];

  @OneToMany<Comment>(() => Comment, (comment: Comment) => comment.part)
  comments: Comment[];
}
