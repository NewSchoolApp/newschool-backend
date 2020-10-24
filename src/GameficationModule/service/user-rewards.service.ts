import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { AchievementRepository } from '../repository/achievement.repository';
import { StartEventShareCourseRuleDTO } from '../dto/start-event-share-course.dto';
import { EventNameEnum } from '../enum/event-name.enum';
import { BadgeRepository } from '../repository/badge.repository';
import * as PubSub from 'pubsub-js';
import { CourseTaken } from '../../CourseModule/entity/course.taken.entity';
import { CourseTakenStatusEnum } from '../../CourseModule/enum/enum';
import { Achievement } from '../entity/achievement.entity';
import { UserService } from '../../UserModule/service/user.service';
import { CourseService } from '../../CourseModule/service/course.service';
import { CourseTakenService } from '../../CourseModule/service/course.taken.service';
import { StartEventRateAppRuleDTO } from '../dto/start-event-rate-app.dto';
import { User } from '../../UserModule/entity/user.entity';
import { Badge } from '../entity/badge.entity';

export interface SharedCourseRule {
  courseId: string;
}

export interface InviteUserRewardData {
  inviteKey: string;
}

@Injectable()
export class UserRewardsService implements OnModuleInit {
  private readonly logger = new Logger(UserRewardsService.name);

  constructor(
    private readonly achievementRepository: AchievementRepository,
    private readonly badgeRepository: BadgeRepository,
    private readonly userService: UserService,
    private readonly courseService: CourseService,
    private readonly courseTakenService: CourseTakenService,
  ) {}

  onModuleInit(): void {
    this.logger.log('me inscrevendo nos métodos do UserRewardsService');
    PubSub.subscribe(
      EventNameEnum.USER_REWARD_SHARE_COURSE,
      async (message: string, data: StartEventShareCourseRuleDTO) => {
        await this.shareCourseReward(data);
      },
    );
    PubSub.subscribe(
      EventNameEnum.USER_REWARD_RATE_APP,
      async (message: string, data: StartEventRateAppRuleDTO) => {
        await this.rateAppReward(data);
      },
    );
    PubSub.subscribe(
      EventNameEnum.USER_REWARD_INVITE_USER,
      async (message: string, data: InviteUserRewardData) => {
        console.log('to aqui no subscribe');
        await this.inviteUserReward(data);
      },
    );
  }

  private async shareCourseReward({
    courseId,
    userId,
    platform,
  }: StartEventShareCourseRuleDTO): Promise<void> {
    const [user, course] = await Promise.all([
      this.userService.findById(userId),
      this.courseService.findById(courseId),
    ]);
    if (!user || !course) return;
    const courseTaken: CourseTaken = await this.courseTakenService.findByUserIdAndCourseId(
      user.id,
      course.id,
    );
    if (!courseTaken) return;

    if (
      courseTaken.status !== CourseTakenStatusEnum.COMPLETED ||
      courseTaken.completion !== 100
    )
      return;

    const [
      sharedCourse,
    ] = await this.achievementRepository.getSharedCourseByCourseIdAndUserIdAndSocialMedia<
      Achievement<SharedCourseRule>
    >(courseId, userId, platform);
    if (sharedCourse) return;

    const badge = await this.badgeRepository.findByEventNameAndOrder(
      EventNameEnum.USER_REWARD_SHARE_COURSE,
      1,
    );

    await this.achievementRepository.save({
      ...sharedCourse,
      user,
      badge,
      rule: { courseId, platform },
      completed: true,
      eventName: EventNameEnum.USER_REWARD_SHARE_COURSE,
    });
  }

  private async rateAppReward({ userId, rate }: StartEventRateAppRuleDTO) {
    const user = await this.userService.findById(userId);
    const badge = await this.badgeRepository.findByEventNameAndOrder(
      EventNameEnum.USER_REWARD_RATE_APP,
      1,
    );
    if (!badge) return;
    const achievement = await this.achievementRepository.findByUserIdAndBadgeId(
      user.id,
      badge.id,
    );
    if (achievement) return;
    await this.achievementRepository.save({
      ...achievement,
      badge,
      user,
      eventName: EventNameEnum.USER_REWARD_RATE_APP,
      completed: true,
      rule: { rate },
    });
  }

  private async inviteUserReward({ inviteKey }: InviteUserRewardData) {
    // 1 - Pegar usuário com essa inviteKey
    // 2 - Se tiver usuário com essa inviteKey, pegar a quantidade todos os usuários que foram convidados por esse usuário
    // 3 - Calcular quantos achievements o cara precisa ter baseado na quantidade de usuários que foram convidados por ele
    // e.g: o cara convidou 3 pessoas, então ele precisa ter 1 achievement
    // e.g: O cara convidou 4 pessoas, ele ainda vai ter 1 achievement
    // e.g: o cara convidou 6 pessoas, ele vai ter 2 achievements
    console.log('to aqui no método', inviteKey);
    const userWithGivenInviteKey: User = await this.userService.findByInviteKey(
      inviteKey,
    );

    const usersInvitedCount: number = await this.userService.countUsersInvitedByUserId(
      userWithGivenInviteKey.id,
    );

    const neededAchievementsQuantity: number = Math.trunc(
      usersInvitedCount / 3,
    );

    if (neededAchievementsQuantity === 0) return;

    const inviteUsersBadge: Badge = await this.badgeRepository.findByEventNameAndOrder(
      EventNameEnum.USER_REWARD_INVITE_USER,
      1,
    );

    if (!inviteUsersBadge) return;

    const countInviteUserAchievements: number = await this.achievementRepository.countAchievementsByBadgeId(
      inviteUsersBadge.id,
    );

    if (neededAchievementsQuantity === countInviteUserAchievements) return;

    const achievementsDifference =
      neededAchievementsQuantity - countInviteUserAchievements;

    for (let counter = 0; counter < achievementsDifference; counter++) {
      await this.achievementRepository.save({
        badge: inviteUsersBadge,
        user: userWithGivenInviteKey,
        eventName: EventNameEnum.USER_REWARD_INVITE_USER,
        completed: true,
      });
    }
  }
}
