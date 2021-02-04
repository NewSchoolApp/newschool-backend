import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClientCredentials } from './client-credentials.entity';
import { User } from '../../UserModule/entity/user.entity';
import { Audit } from '../../CommonsModule/entity/audit.entity';
import { Policy } from './policy.entity';
import slugify from 'slugify';

@Entity()
export class Role extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    nullable: false,
    unique: true,
  })
  get slug(): string {
    return slugify(this.name);
  }

  set slug(name: string) {}

  @ManyToMany<Policy>(() => Policy, (policy) => policy.roles)
  @JoinTable()
  policies: Policy[];

  @OneToMany<ClientCredentials>(
    () => ClientCredentials,
    (clientCredentials: ClientCredentials) => clientCredentials.role,
  )
  clientCredentials: ClientCredentials[];

  @OneToMany<User>(() => User, (user: User) => user.role)
  users: User[];
}
