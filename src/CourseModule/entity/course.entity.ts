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
    name: 'thumbUrl',
    nullable: true,
  })
  thumbUrlFromDatabase: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  @Expose()
  authorId: string;
  
  @Column()
  photoName: string;

  @OneToMany<Lesson>(() => Lesson, (lesson: Lesson) => lesson.course)
  lessons: Lesson[];


  @Expose()
  get thumbUrl(): string {
    if (this.thumbUrlFromDatabase && /^http(s?):\/\//.test(this.thumbUrlFromDatabase)) {
      return this.thumbUrlFromDatabase;
    }
    const fileName = this.photoName || this.thumbUrlFromDatabase;
    if (fileName) {
      return 'https://newschoolbrapi-dev.herokuapp.com/api/v1/upload/' + fileName;
    }
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  set thumbUrl(thumbUrl: string) {
    this.thumbUrlFromDatabase = thumbUrl;
  }

  @Column()
  @Expose()
  get slug(): string {
    return slugify(this.title, { replacement: '-', lower: true });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  set slug(slug: string) {
  }

}
