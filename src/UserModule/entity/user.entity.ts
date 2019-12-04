import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from '../../CommonsModule';
import { RoleEnum } from '../../SecurityModule/enum';

@Entity()
export class User extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ name: 'url_facebook' })
  urlFacebook: string;

  @Column({ name: 'url_instagram' })
  urlInstagram: string;

  @Column({
    default: '',
  })
  salt: string;

  @Column({ type: 'varchar', nullable: false })
  role: RoleEnum;
}
