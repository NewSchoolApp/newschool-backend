import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Audit } from '../../CommonsModule';
import { Lesson } from './lesson.entity';

@Entity()
export class Course extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  title: string;

  @Column({
    nullable: false,
  })
  description: string;

  @Column({
    nullable: true,
  })
  thumbUrl: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  authorId: string;

  @OneToMany(
    type => Lesson,
    lesson => lesson.course,
    { eager: true },
  )
  lessons: Lesson[];
}
