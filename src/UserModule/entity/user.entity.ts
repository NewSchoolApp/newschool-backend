import * as crypto from 'crypto';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from '../../CommonsModule';
import { Role } from '../../SecurityModule';
import { ChangePassword } from './change-password.entity';
import { Certificate } from '../../CertificateModule/entity';
import { Expose } from 'class-transformer';
import { Course } from '../../CourseModule';

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

  @Column()
  @Expose()
  email: string;

  @Column()
  @Expose()
  password: string;

  @Column({ name: 'url_facebook', nullable: true })
  @Expose()
  urlFacebook: string;

  @Column({ name: 'url_instagram', nullable: true })
  @Expose()
  urlInstagram: string;

  @Column({
    default: '',
  })
  @Expose()
  salt: string;

  @ManyToOne(() => Role, (role: Role) => role.users)
  @Expose()
  role: Role;

  @OneToMany<ChangePassword>(() => ChangePassword, (changePassword: ChangePassword) => changePassword.user)
  @Expose()
  changePasswordRequests: ChangePassword[];

  @ManyToMany(() => Certificate, (certficate: Certificate) => certficate.users)
  @Expose()
  certificates: Certificate[];

  @OneToMany<Course>('Course', (course: Course) => course.author)
  createdCourses: Course[];

  validPassword(password: string) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
    return this.password === hash;
  }
}
