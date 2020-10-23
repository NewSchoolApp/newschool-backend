import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { NotificationTypeEnum } from '../enum/notification-type.enum';
import { User } from '../../UserModule/entity/user.entity';
import { Audit } from '../../CommonsModule/entity/audit.entity';

@Entity()
export class Notification<T> extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user: User) => user.notifications)
  user: User;

  @Column({
    default: true,
  })
  seen: boolean;

  @Column({
    type: 'enum',
    enum: NotificationTypeEnum,
    nullable: false,
  })
  type: NotificationTypeEnum;

  @Column({
    type: 'json',
    nullable: false,
  })
  content: T;
}
