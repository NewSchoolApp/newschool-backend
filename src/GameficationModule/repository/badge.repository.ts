import { Badge } from '../entity/badge.entity';
import { EntityRepository, Repository } from 'typeorm';
import { EventNameEnum } from '../enum/event-name.enum';

@EntityRepository(Badge)
export class BadgeRepository extends Repository<Badge> {
  public findByEventNameAndOrder(
    eventName: EventNameEnum,
    eventOrder: number,
  ): Promise<Badge> {
    return this.findOne({
      eventName,
      eventOrder,
    });
  }
}
