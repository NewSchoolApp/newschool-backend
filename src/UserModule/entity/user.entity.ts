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
import { Certificate } from '../../CertificateModule/entity/certificate.entity';
import { GenderEnum } from '../enum/gender.enum';
import { EscolarityEnum } from '../enum/escolarity.enum';

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

  @Column()
  @Expose()
  password: string;

  @Column({ nullable: false })
  @Expose()
  nickname: string;

  @Column({ nullable: false })
  @Expose()
  birthday: Date;

  @Column({ type: 'enum', enum: GenderEnum, nullable: false })
  @Expose()
  gender: GenderEnum;

  @Column({ type: 'enum', enum: EscolarityEnum, nullable: false })
  @Expose()
  schooling: EscolarityEnum;

  @Column({ nullable: false })
  @Expose()
  institutionName: string;

  @Column({ nullable: false })
  @Expose()
  profession: string;

  @Column({ nullable: false })
  @Expose()
  address: string;

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

  @ManyToMany('Certificate', (certficate: Certificate) => certficate.users)
  @Expose()
  certificates: Certificate[];

  @OneToMany<CourseTaken>(
    'CourseTaken',
    (courseTaken: CourseTaken) => courseTaken.user,
  )
  coursesTaken: CourseTaken[];

  validPassword(password: string) {
    const hash = crypto
      .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
      .toString(`hex`);
    return this.password === hash;
  }
}
