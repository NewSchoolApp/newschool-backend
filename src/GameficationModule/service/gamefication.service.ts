import { Injectable } from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { StartEventRules } from '../dto/start-event-rules.dto';
import { StartEventEnum } from '../enum/start-event.enum';
import { AchievementRepository } from '../repository/achievement.repository';
import { OrderEnum } from 'src/CommonsModule/enum/order.enum';
import { getRankingUser } from '../interfaces/getRankingUser';

@Injectable()
export class GameficationService {
  constructor(
    private readonly publisherService: PublisherService,
    private readonly achivementRepository: AchievementRepository,
  ) {}

  startEvent(event: StartEventEnum, rule: StartEventRules): void {
    this.publisherService.startEvent(event, rule);
  }

  getRanking(order: OrderEnum): Promise<getRankingUser[]> {
    return this.achivementRepository.getRanking(order);
  }
}
