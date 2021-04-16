import { Injectable } from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { StartEventRules } from '../dto/start-event-rules.dto';
import { StartEventEnum } from '../enum/start-event.enum';
import { AchievementRepository } from '../repository/achievement.repository';
import { OrderEnum } from '../../CommonsModule/enum/order.enum';
import { TimeRangeEnum } from '../enum/time-range.enum';
import { RankingDTO } from '../dto/ranking.dto';
import { UserService } from '../../UserModule/service/user.service';
import { UploadService } from '../../UploadModule/service/upload.service';
import { Pageable } from '../../CommonsModule/dto/pageable.dto';
import { RankingQueryDTO } from '../dto/ranking-query.dto';

@Injectable()
export class GameficationService {
  constructor(
    private readonly publisherService: PublisherService,
    private readonly achivementRepository: AchievementRepository,
    private readonly userService: UserService,
    private readonly uploadService: UploadService,
  ) {}

  startEvent(event: StartEventEnum, rule: StartEventRules): void {
    this.publisherService.startEvent(event, rule);
  }

  async getRanking(
    order: OrderEnum,
    timeRange: TimeRangeEnum,
    limit: number,
    page: number,
    institutionName?: string,
    city?: string,
    state?: string,
  ): Promise<Pageable<RankingQueryDTO>> {
    const result: Pageable<RankingQueryDTO> = await this.achivementRepository.getRankingPaginated(
      order,
      timeRange,
      limit,
      page,
      institutionName,
      city,
      state,
    );

    let rankedUsers = [];

    for (const rankedUser of result.content) {
      const { photoPath, ...rankedUserInfo } = rankedUser;
      const user: RankingDTO = {
        ...rankedUserInfo,
        photo: photoPath
          ? await this.uploadService.getUserPhoto(photoPath)
          : null,
      };
      rankedUsers = [...rankedUsers, user];
    }

    return { ...result, content: rankedUsers };
  }

  public async getUserRanking(
    userId: string,
    options: {
      timeRange;
      institutionName;
      city;
      state;
    },
  ): Promise<RankingDTO> {
    await this.userService.findById(userId);
    return this.achivementRepository.getUserRanking(userId, options);
  }

  public async getUserTotalPoints(
    userId: string,
  ): Promise<RankingDTO | undefined> {
    await this.userService.findById(userId);
    return this.achivementRepository.getUserTotalPoints(userId);
  }
}
