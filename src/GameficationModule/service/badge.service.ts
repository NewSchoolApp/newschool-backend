import { Injectable } from '@nestjs/common';
import { EventNameEnum } from '../enum/event-name.enum';
import { BadgeRepository } from '../repository/badge.repository';

@Injectable()
export class BadgeService {
  constructor(private readonly repository: BadgeRepository) {}

  badgeUpdate(
    eventName: EventNameEnum,
    eventOrder: number,
    name: string,
    description: string,
    points: number,
  ) {
    const badge = this.repository.findByEventNameAndOrder(
      eventName,
      eventOrder,
      points,
    );
  }
}
