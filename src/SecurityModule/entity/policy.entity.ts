import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import slugify from 'slugify';
import { Audit } from '../../CommonsModule/entity/audit.entity';
import { Role } from './role.entity';

@Entity()
export class Policy extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    nullable: false,
    unique: true,
  })
  get slug(): string {
    return slugify(this.name);
  }

  set slug(name: string) {}

  @ManyToMany<Role>(() => Role, (role: Role) => role.policies)
  roles: Role[];
}
