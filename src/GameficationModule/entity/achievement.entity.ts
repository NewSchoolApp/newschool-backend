import { Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Badge } from './badge.entity';
import { Audit } from '../../CommonsModule/entity/audit.entity';
import { User } from '../../UserModule/entity/user.entity';

@Entity()
export class Achievement<T = unknown> extends Audit {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column({ type: 'json' })
  rule: T;

  @Column()
  completed: boolean;

  @Column()
  points: number;

  @ManyToOne(() => Badge, (badge: Badge) => badge.achievements)
  @Expose()
  badge: Badge;

  @ManyToOne(() => User, (user: User) => user.achievements)
  @Expose()
  user: User;
}
