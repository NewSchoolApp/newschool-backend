import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Audit } from '../../CommonsModule';
import { Lesson } from './lesson.entity';
import { Test } from './test.entity';

@Entity()
export class Part extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  vimeo_link: string;

  @Column()
  youtube_link: string;

  @ManyToOne(
    type => Lesson,
    lesson => lesson.parts,
  )
  lesson: Lesson;

  @OneToMany(
    () => Test,
    test => test.part,
  )
  tests: Test[];
}
