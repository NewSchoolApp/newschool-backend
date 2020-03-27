import { Audit } from '../../CommonsModule';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { Part } from './part.entity';
import { Expose } from 'class-transformer';
import { CourseTaken } from '../../CourseTakenModule/entity';

@Unique(['sequenceNumber', 'part'])
@Entity()
export class Test extends Audit {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column({
    name: 'title',
  })
  @Expose()
  title: string;

  @Column({
    nullable: true,
    name: 'question',
  })
  @Expose()
  question?: string;

  @Column({
    name: 'correct_alternative',
  })
  @Expose()
  correctAlternative: string;

  @Column({
    name: 'first_alternative',
  })
  @Expose()
  firstAlternative: string;

  @Column({
    name: 'second_alternative',
  })
  @Expose()
  secondAlternative: string;

  @Column({
    name: 'third_alternative',
  })
  @Expose()
  thirdAlternative: string;

  @Column({
    name: 'fourth_alternative',
  })
  @Expose()
  fourthAlternative: string;

  @Column({
    nullable: false,
    name: 'seq_num',
  })
  sequenceNumber: number;

  @Expose()
  @ManyToOne<Part>(
    () => Part,
    (part: Part) => part.tests,
  )
  @JoinColumn({
    name: 'part_id',
  })
  part: Part;

  @OneToMany<CourseTaken>(
    'CourseTaken',
    (courseTaken: CourseTaken) => courseTaken.currentTest,
  )
  currentCoursesTaken: CourseTaken[];
}
