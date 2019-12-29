import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Audit } from '../../CommonsModule';
import { Course } from './course.entity';
import { Part } from './part.entity';

@Entity()
export class Lesson extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  description: string;

  @ManyToOne(
    type => Course,
    course => course.lessons,
  )
  course: Course;

  @OneToMany(
    () => Part,
    part => part.lesson,
  )
  parts: Part[];
}
