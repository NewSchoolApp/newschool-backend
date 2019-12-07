import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoleEnum } from '../enum';
import { Audit } from '../../CommonsModule/entity';
import { ClientCredentials } from './client-credentials.entity';
import { IsEnum } from 'class-validator';
import { User } from '../../UserModule/entity';

@Entity()
export class Role extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsEnum(RoleEnum)
  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: RoleEnum;

  @OneToMany<ClientCredentials>(() => ClientCredentials, (clientCredentials: ClientCredentials) => clientCredentials.role)
  clientCredentials: ClientCredentials[];

  @OneToMany<User>(() => User, (user: User) => user.role)
  users: User[];
}
