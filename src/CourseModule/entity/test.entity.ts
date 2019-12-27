import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Audit } from 'src/CommonsModule';
import { Part } from './part.entity';
import { Alternative } from './alternative.entity';

@Entity()
export class Test extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  available: boolean;

  @ManyToOne(
    type => Part,
    part => part.tests,
  )
  part: Part;

  @OneToMany(
    () => Alternative,
    alternative => alternative.test,
  )
  alternatives: Alternative[];
}
