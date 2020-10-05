import * as crypto from 'crypto';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../SecurityModule/entity/role.entity';
import { ChangePassword } from './change-password.entity';
import { Expose } from 'class-transformer';
import { CourseTaken } from '../../CourseTakenModule/entity/course.taken.entity';
import { Audit } from '../../CommonsModule/entity/audit.entity';
import { GenderEnum } from '../enum/gender.enum';
import { EscolarityEnum } from '../enum/escolarity.enum';
import { UserProfileEnum } from '../enum/user-profile.enum';
import { Achievement } from '../../GameficationModule/entity/achievement.entity';
import { Notification } from '../../NotificationModule/entity/notification.entity';

@Entity()
export class User extends Audit {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column({
    nullable: false,
  })
  @Expose()
  name: string;

  @Column({ unique: true })
  @Expose()
  email: string;

  @Column({
    nullable: false,
    name: 'profile',
    type: 'enum',
    enum: UserProfileEnum,
  })
  @Expose()
  profile: UserProfileEnum;

  @Column()
  @Expose()
  password: string;

  @Column({ nullable: true })
  @Expose()
  nickname?: string;

  @Column({ nullable: true })
  @Expose()
  birthday?: Date;

  @Column({ type: 'enum', enum: GenderEnum, nullable: true })
  @Expose()
  gender?: GenderEnum;

  @Column({ type: 'enum', enum: EscolarityEnum, nullable: true })
  @Expose()
  schooling?: EscolarityEnum;

  @Column({ nullable: true })
  @Expose()
  institutionName?: string;

  @Column({ nullable: true })
  @Expose()
  profession?: string;

  @Column({ nullable: true })
  @Expose()
  address?: string;

  @Column({ name: 'url_facebook', nullable: true })
  @Expose()
  urlFacebook?: string;

  @Column({ name: 'url_instagram', nullable: true })
  @Expose()
  urlInstagram?: string;

  @Column({
    default: '',
  })
  @Expose()
  salt: string;

  @Column({
    default: false,
  })
  @Expose()
  enabled: boolean;

  @Column({ name: 'facebook_id', nullable: true })
  @Expose()
  facebookId?: string;

  @Column({ name: 'google_sub', nullable: true })
  @Expose()
  googleSub?: string;

  @ManyToOne(() => Role, (role: Role) => role.users)
  @Expose()
  role: Role;

  @OneToMany<ChangePassword>(
    'ChangePassword',
    (changePassword: ChangePassword) => changePassword.user,
  )
  @Expose()
  changePasswordRequests: ChangePassword[];

  @OneToMany<CourseTaken>(
    'CourseTaken',
    (courseTaken: CourseTaken) => courseTaken.user,
  )
  coursesTaken: CourseTaken[];

  @OneToMany(() => Achievement, (achievement: Achievement) => achievement.badge)
  @Expose()
  achievements: Achievement[];

  @OneToMany(
    () => Notification,
    (notification: Notification<any>) => notification.user,
  )
  notifications: Notification<any>;

  validPassword(password: string) {
    const hash = crypto
      .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
      .toString(`hex`);
    return this.password === hash;
  }
}
