import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
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

  @ManyToMany(() => User, (user: User) => user.certificates)
  @JoinTable()
  @Expose()
  users: User[];
}
