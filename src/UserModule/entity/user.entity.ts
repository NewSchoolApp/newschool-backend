import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from '../../CommonsModule';
import { Role } from '../../SecurityModule/entity';

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

  @Column()
  salt: string;

  @ManyToOne(() => Role, (role: Role) => role.users)
  role: string;
}
