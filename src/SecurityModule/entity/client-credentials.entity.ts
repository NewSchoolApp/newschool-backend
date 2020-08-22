import { GrantTypeEnum } from './../enum/grant-type.enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ClientCredentialsEnum } from '../enum/client-credentials.enum';
import { Role } from './role.entity';
import { Audit } from '../../CommonsModule/entity/audit.entity';

@Entity({ name: 'client-credentials' })
export class ClientCredentials extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ClientCredentialsEnum,
    nullable: false,
    unique: true,
  })
  name: ClientCredentialsEnum;

  @Column({ type: 'varchar' })
  secret: string;

  @Column({
    type: 'enum',
    enum: GrantTypeEnum,
    nullable: false,
  })
  grantType: GrantTypeEnum;

  @Column({
    name: 'access_token_validity',
    nullable: false,
  })
  accessTokenValidity: number;

  @Column({
    name: 'refresh_token_validity',
    nullable: false,
  })
  refreshTokenValidity: number;

  @ManyToOne<Role>(() => Role, (role: Role) => role.clientCredentials)
  role: Role;
}
