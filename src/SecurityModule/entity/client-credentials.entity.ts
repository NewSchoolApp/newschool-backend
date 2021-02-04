import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import slugify from 'slugify';
import { Role } from './role.entity';
import { GrantTypeEnum } from '../enum/grant-type.enum';
import { Audit } from '../../CommonsModule/entity/audit.entity';

@Entity({ name: 'client-credentials' })
export class ClientCredentials extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  private _slug: string;

  @Column({
    nullable: false,
    unique: true,
  })
  get slug(): string {
    return slugify(this.name);
  }

  set slug(name: string) {}

  @Column({ type: 'varchar' })
  secret: string;

  @Column({
    name: 'authorized_grant_types',
  })
  private _authorizedGrantTypes: string;

  @Column({
    name: 'access_token_validity',
    nullable: false,
  })
  accessTokenValidity: number;

  @Column({
    name: 'refresh_token_validity',
    nullable: true,
  })
  refreshTokenValidity?: number;

  @ManyToOne<Role>(() => Role, (role: Role) => role.clientCredentials)
  role: Role;

  @Expose()
  get authorizedGrantTypes(): string[] {
    return this._authorizedGrantTypes
      .split(',')
      .filter((grantType) => grantType);
  }

  set authorizedGrantTypes(authorizedGrantTypes: string[]) {
    this._authorizedGrantTypes = authorizedGrantTypes.join(',');
  }

  @BeforeInsert()
  setId() {
    this.slug = slugify(this.name);
  }
}
