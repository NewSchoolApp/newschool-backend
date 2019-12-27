import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Audit } from 'src/CommonsModule';
import { Part } from './part.entity';

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
}
