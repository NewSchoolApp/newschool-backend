import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from '../../CommonsModule';
import { Lesson } from './lesson.entity';
import { Expose } from 'class-transformer';
import slugify from 'slugify';

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

  @Column()
  @Expose()
  get slug(): string {
    return slugify(this.title, { replacement: '-', lower: true });
  }

  set slug(slug: string) {
  }
}
