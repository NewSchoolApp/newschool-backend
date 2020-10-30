import { Injectable } from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { StartEventRules } from '../dto/start-event-rules.dto';
import { StartEventEnum } from '../enum/start-event.enum';
import { AchievementRepository } from '../repository/achievement.repository';
import { OrderEnum } from '../../CommonsModule/enum/order.enum';
import { TimeRangeEnum } from '../enum/time-range.enum';
import { RankingDTO } from '../dto/ranking.dto';
import { UserService } from '../../UserModule/service/user.service';

@Injectable()
export class GameficationService {
  constructor(
    private readonly publisherService: PublisherService,
    private readonly achivementRepository: AchievementRepository,
    private readonly userService: UserService,
  ) {}

  startEvent(event: StartEventEnum, rule: StartEventRules): void {
    this.publisherService.startEvent(event, rule);
  }

  getRanking(
    order: OrderEnum,
    timeRange: TimeRangeEnum,
    institutionName?: string,
    city?: string,
    state?: string,
  ): Promise<RankingDTO[]> {
    return this.achivementRepository.getRanking(
      order,
      timeRange,
      institutionName,
      city,
      state,
    );
  }

  public async getUserRanking(
    userId: string,
    timeRange: TimeRangeEnum,
  ): Promise<RankingDTO> {
    await this.userService.findById(userId);
    return this.achivementRepository.getUserRanking(userId, timeRange);
  }
}
