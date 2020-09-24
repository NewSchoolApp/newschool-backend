import { Badge } from './../entity/badge.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Badge)
export class BadgeRepository extends Repository<Badge> {
  public findBySlug(slug: string): Promise<Badge> {
    return this.findOne({ slug });
  }
}
