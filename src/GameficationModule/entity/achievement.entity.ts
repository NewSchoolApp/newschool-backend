import { Expose } from 'class-transformer';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Badge } from './badge.entity';
import { Audit } from '../../CommonsModule/entity/audit.entity';
import { User } from '../../UserModule/entity/user.entity';
import { EventNameEnum } from '../enum/event-name.enum';

@Entity()
export class Achievement<T = unknown> extends Audit {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column({
    type: 'enum',
    enum: EventNameEnum,
  })
  eventName: EventNameEnum;

  @Column({ type: 'json' })
  rule: T;

  @Column()
  completed: boolean;

  @Column({ nullable: false })
  points: number;

  @ManyToOne(() => Badge, (badge: Badge) => badge.achievements)
  @Expose()
  badge: Badge;

  @ManyToOne(() => User, (user: User) => user.achievements)
  @Expose()
  user: User;
}
