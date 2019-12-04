import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ClientCredentialsEnum } from '../enum';
import { Audit } from '../../CommonsModule';
import { Role } from './role.entity';
import { IsEnum } from 'class-validator';

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

  @ManyToOne(() => Role, (role: Role) => role.clientCredentials)
  role: string;
}
