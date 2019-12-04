import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ClientCredentialsEnum, RoleEnum } from '../enum';
import { Audit } from '../../CommonsModule';
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

  @Column()
  role: RoleEnum.ADMIN;
}
