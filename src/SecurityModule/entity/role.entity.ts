import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RoleEnum } from '../enum';
import { Audit } from '../../CommonsModule/entity';
import { ClientCredentials } from './client-credentials.entity';
import { IsEnum } from 'class-validator';

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

  @ManyToOne(() => ClientCredentials, (clientCredentials: ClientCredentials) => clientCredentials.role)
  clientCredentials: ClientCredentials;
}
