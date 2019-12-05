import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from '../../CommonsModule';

@Entity()
export class Course extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  name: string;

}
