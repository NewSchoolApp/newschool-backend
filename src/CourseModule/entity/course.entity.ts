import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from '../../CommonsModule';

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
    nullable: true
  })
  thumbUrl: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  authorId: string;

}
