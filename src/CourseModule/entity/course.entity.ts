import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Audit } from '../../CommonsModule';
import { Lesson } from './lesson.entity';
import { Expose } from 'class-transformer';

@Entity()
export class Course extends Audit {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column({
    nullable: false,
  })
  @Expose()
  title: string;

  @Column({
    nullable: false,
  })
  @Expose()
  description: string;

  @Column({
    nullable: true,
  })
  @Expose()
  thumbUrl: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  @Expose()
  authorId: string;
}
