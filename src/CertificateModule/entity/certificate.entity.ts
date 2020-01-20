import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../UserModule/entity';
import { Expose } from 'class-transformer';

@Entity()
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column()
  @Expose()
  title: string;

  @Column()
  @Expose()
  text: string;

  // field created to have in assets different images being passed for each course created
  @Column()
  @Expose()
  certificateBackgroundName: string;

  @ManyToMany(
    () => User,
    (user: User) => user.certificates,
  )
  @JoinTable()
  @Expose()
  users: User[];
}
