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
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose()
  @Column({
    nullable: false,
    name: 'title',
  })
  title: string;

  @Expose()
  @Column({
    nullable: true,
    name: 'question',
  })
  question: string;

  @Expose()
  @Column({
    nullable: false,
    name: 'correct_alternative',
  })
  correctAlternative: string;

  @Expose()
  @Column({
    nullable: false,
    name: 'first_alternative',
  })
  firstAlternative: string;

  @Expose()
  @Column({
    nullable: false,
    name: 'second_alternative',
  })
  secondAlternative: string;

  @Expose()
  @Column({
    nullable: false,
    name: 'third_alternative',
  })
  thirdAlternative: string;

  @Expose()
  @Column({
    nullable: false,
    name: 'fourth_alternative',
  })
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
