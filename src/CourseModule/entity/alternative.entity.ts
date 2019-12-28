import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Audit } from '../../CommonsModule';
import { Test } from './test.entity';

@Entity()
export class Alternative extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  correct: boolean;

  @ManyToOne(
    type => Test,
    test => test.alternatives,
  )
  test: Test;
}
