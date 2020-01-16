import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoleEnum } from '../enum';
import { Audit } from '../../CommonsModule/entity';
import { ClientCredentials } from './client-credentials.entity';
import { User } from '../../UserModule';

@Entity()
export class Role extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    nullable: false,
    unique: true,
  })
  name: RoleEnum;

  @OneToMany<ClientCredentials>(() => ClientCredentials, (clientCredentials: ClientCredentials) => clientCredentials.role)
  clientCredentials: ClientCredentials[];

  @OneToMany<User>(() => User, (user: User) => user.role)
  users: User[];
}
