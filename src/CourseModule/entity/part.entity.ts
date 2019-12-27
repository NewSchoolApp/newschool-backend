import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Audit } from 'src/CommonsModule';
import { Lesson } from './lesson.entity';

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
}
