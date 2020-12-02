import { Badge } from '../entity/badge.entity';
import { EntityRepository, Repository } from 'typeorm';
import { EventNameEnum } from '../enum/event-name.enum';

@EntityRepository(Badge)
export class BadgeRepository extends Repository<Badge> {
  public async findByEventNameAndOrder(
    eventName: EventNameEnum,
    eventOrder: number,
  ): Promise<Badge> {
    const queryResponse = await this.find({
      eventName,
      eventOrder,
    });
    return queryResponse[0];
  }
}
