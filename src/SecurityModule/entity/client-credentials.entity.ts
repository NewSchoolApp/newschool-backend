import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ClientCredentialsEnum } from '../enum';
import { Audit } from '../../CommonsModule';
import { IsEnum } from 'class-validator';
import { Role } from './role.entity';

@Entity({ name: 'client-credentials' })
export class ClientCredentials extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsEnum(ClientCredentialsEnum)
  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: ClientCredentialsEnum;

  @Column({ type: 'varchar' })
  secret: string;

  @ManyToOne<Role>(() => Role, (role: Role) => role.clientCredentials)
  role: Role;
}
