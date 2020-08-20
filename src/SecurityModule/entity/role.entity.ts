import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoleEnum } from '../enum/role.enum';
import { ClientCredentials } from './client-credentials.entity';
import { User } from '../../UserModule/entity/user.entity';
import { Audit } from '../../CommonsModule/entity/audit.entity';

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

  @OneToMany<ClientCredentials>(
    () => ClientCredentials,
    (clientCredentials: ClientCredentials) => clientCredentials.role,
  )
  clientCredentials: ClientCredentials[];

  @OneToMany<User>(() => User, (user: User) => user.role)
  users: User[];
}
