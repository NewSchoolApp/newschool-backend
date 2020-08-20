import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Audit } from '../../CommonsModule/entity/audit.entity';

@Entity()
export class ChangePassword extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  expirationTime: number;

  @ManyToOne<User>(() => User, (user: User) => user.changePasswordRequests)
  user: User;
}
