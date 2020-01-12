import { Audit } from '../../CommonsModule';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Lesson } from './lesson.entity';
import { Test } from './test.entity';

@Unique(['sequenceNumber', 'lesson'])
@Entity()
export class Part extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    name: 'title',
  })
  title: string;

  @Column({
    nullable: false,
    name: 'description',
  })
  description: string;

  @Column({
    nullable: true,
    name: 'vimeo_url',
  })
  vimeoUrl: string;

  @Column({
    nullable: true,
    name: 'youtube_url',
  })
  youtubeUrl: string;

  @ManyToOne<Lesson>(() => Lesson, (lesson: Lesson) => lesson.parts)
  @JoinColumn({
    name: 'lesson_id',
  })
  lesson: Lesson;

  @Column({
    nullable: false,
    name: 'seq_num',
  })
  sequenceNumber: number;

  @OneToMany<Test>(() => Test, (test: Test) => test.part)
  tests: Test[];
}
