import { Achievement } from './achievement.entity';
import slugify from 'slugify';
import { Expose } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from '../../CommonsModule/entity/audit.entity';
import { EventNameEnum } from '../enum/event-name.enum';

@Entity()
export class Badge extends Audit {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column({
    type: 'enum',
    enum: EventNameEnum,
  })
  eventName: EventNameEnum;

  @Column()
  eventOrder: number;

  @Column()
  badgeName: string;

  @Column()
  badgeDescription: string;

  @Column()
  points: number;

  private _slug: string;

  @Column({ name: 'slug' })
  get slug(): string {
    return slugify(this.badgeName, { replacement: '-', lower: true });
  }

  set slug(slug: string) {
    this._slug = slugify(this.badgeName, { replacement: '-', lower: true });
  }

  @OneToMany(() => Achievement, (achievement: Achievement) => achievement.badge)
  @Expose()
  achievements: Achievement[];
}
