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

  @ManyToOne(() => Badge, (badge: Badge) => badge.achievements)
  @Expose()
  badge: Badge;

  user: User;

  @Column({ type: 'json' })
  rule: T;

  @Column()
  completed: boolean;
}
