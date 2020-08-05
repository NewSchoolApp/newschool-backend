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

  @ManyToOne<Role>(
    () => Role,
    (role: Role) => role.clientCredentials,
  )
  role: Role;
}
