import { Injectable, OnModuleInit } from '@nestjs/common';
import { AchievementRepository } from '../repository/achievement.repository';
import { StartEventShareCourseRuleDTO } from '../dto/start-event-share-course.dto';
import { EventNameEnum } from '../enum/event-name.enum';
import { BadgeRepository } from '../repository/badge.repository';
import * as PubSub from 'pubsub-js';
import { CourseTaken } from '../../CourseModule/entity/course-taken.entity';
import { Achievement } from '../entity/achievement.entity';
import { StartEventRateAppRuleDTO } from '../dto/start-event-rate-app.dto';
import { User } from '../../UserModule/entity/user.entity';
import { Badge } from '../entity/badge.entity';
import { UserRepository } from '../../UserModule/repository/user.repository';
import { CourseTakenRepository } from '../../CourseModule/repository/course.taken.repository';
import { ShareAppRewardDataDTO } from '../dto/share-app-reward-data.dto';
import { SchedulerRegistry } from '@nestjs/schedule';
import { OrderEnum } from '../../CommonsModule/enum/order.enum';
import { TimeRangeEnum } from '../enum/time-range.enum';
import { RankingQueryDTO } from '../dto/ranking-query.dto';

export interface SharedCourseRule {
  courseId: number;
}

export interface InviteUserRewardData {
  inviteKey: string;
}

@Injectable()
export class UserRewardsService implements OnModuleInit {
  constructor(
    private readonly achievementRepository: AchievementRepository,
    private readonly badgeRepository: BadgeRepository,
    private readonly userRepository: UserRepository,
    private readonly courseTakenRepository: CourseTakenRepository,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  onModuleInit(): void {
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
        await this.inviteUserReward(data);
      },
    );
    PubSub.subscribe(
      EventNameEnum.USER_REWARD_COMPLETE_REGISTRATION,
      async (message: string, data) => {
        await this.completeRegistrationReward(data);
      },
    );
    PubSub.subscribe(
      EventNameEnum.USER_REWARD_SHARE_APP,
      async (message: string, data: ShareAppRewardDataDTO) => {
        await this.shareAppReward(data);
      },
    );
    PubSub.subscribe('*', async () => {
      const alreadyRanTopRankingThisMonth = await this.alreadyRanTopRankingLastMonth();
      if (alreadyRanTopRankingThisMonth) return;
      const tenSecondsInMilliseconds = 60000;
      const callback = () => {
        this.topRankingMonthlyReward();
      };
      const timeout = setTimeout(callback, tenSecondsInMilliseconds);
      this.schedulerRegistry.addTimeout(
        `TOP_RANKING_MONTHLY${new Date().getTime()}`,
        timeout,
      );
    });
  }

  private async shareCourseReward({
    courseId,
    userId,
    platform,
  }: StartEventShareCourseRuleDTO): Promise<void> {
    const courseTaken: CourseTaken = await this.courseTakenRepository.findCompletedByUserIdAndCourseId(
      userId,
      courseId,
    );
    if (!courseTaken) return;

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
      user: { id: userId },
      badge,
      rule: { courseId, platform },
      completed: true,
      eventName: EventNameEnum.USER_REWARD_SHARE_COURSE,
      points: badge.points,
    });
  }

  private async rateAppReward({ userId, rate }: StartEventRateAppRuleDTO) {
    const response: User[] = await this.userRepository.find({
      where: { id: userId },
    });
    const user = response[0];
    if (!user) return;
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
      points: badge.points,
    });
  }

  private async inviteUserReward({
    inviteKey,
  }: InviteUserRewardData): Promise<void> {
    // 1 - Pegar usuário com essa inviteKey
    // 2 - Se tiver usuário com essa inviteKey, pegar a quantidade todos os usuários que foram convidados por esse usuário
    // 3 - Calcular quantos achievements o cara precisa ter baseado na quantidade de usuários que foram convidados por ele
    // e.g: o cara convidou 3 pessoas, então ele precisa ter 1 achievement
    // e.g: O cara convidou 4 pessoas, ele ainda vai ter 1 achievement
    // e.g: o cara convidou 6 pessoas, ele vai ter 2 achievements
    const userWithGivenInviteKey: User = await this.userRepository.findByInviteKey(
      inviteKey,
    );

    if (!userWithGivenInviteKey) return;

    const usersInvitedCount: number = await this.userRepository.countUsersInvitedByUserId(
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
        points: inviteUsersBadge.points,
      });
    }
  }

  private async completeRegistrationReward({ id }) {
    const response: User[] = await this.userRepository.find({ where: { id } });
    const user = response[0];
    if (!user) return;
    const propertiesToCheck: string[] = [
      'address',
      'institutionName',
      'gender',
      'birthday',
      'nickname',
      'cep',
      'houseNumber',
      'phone',
      'state',
    ];
    let isProfileComplete = true;

    propertiesToCheck.forEach((propertyName: string) => {
      if (user[propertyName] == null) isProfileComplete = false;
    });

    if (!isProfileComplete) return;

    const completeRegistrationBadge: Badge = await this.badgeRepository.findByEventNameAndOrder(
      EventNameEnum.USER_REWARD_COMPLETE_REGISTRATION,
      1,
    );

    const achievement: Achievement = await this.achievementRepository.findCompletedByUserIdAndBadgeId(
      user.id,
      completeRegistrationBadge.id,
    );

    if (achievement) return;

    await this.achievementRepository.save({
      badge: completeRegistrationBadge,
      user,
      eventName: EventNameEnum.USER_REWARD_COMPLETE_REGISTRATION,
      completed: true,
      points: completeRegistrationBadge.points,
    });
  }

  private async shareAppReward({
    userId,
    platform,
  }: ShareAppRewardDataDTO): Promise<void> {
    const queryResponse: User[] = await this.userRepository.find({
      where: { id: userId },
    });
    const user = queryResponse[0];
    if (!user) return;

    const responses = await this.achievementRepository.sharedAppThisWeek(
      userId,
    );

    if (responses.length > 3) return;

    const shareAppBadge: Badge = await this.badgeRepository.findByEventNameAndOrder(
      EventNameEnum.USER_REWARD_SHARE_APP,
      1,
    );

    if (!shareAppBadge) return;

    await this.achievementRepository.save({
      badge: shareAppBadge,
      user,
      rule: { platform },
      eventName: EventNameEnum.USER_REWARD_SHARE_APP,
      completed: true,
      points: shareAppBadge.points,
    });
  }

  private async topRankingMonthlyReward() {
    const [
      user,
    ]: RankingQueryDTO[] = await this.achievementRepository.getLastTimeRangeRanking(
      OrderEnum.DESC,
      TimeRangeEnum.MONTH,
      1,
    );

    if (!user) return;

    const badge = await this.badgeRepository.findByEventNameAndOrder(
      EventNameEnum.USER_REWARD_TOP_MONTH,
      1,
    );

    const alreadyRanTopRankingThisMonth = await this.alreadyRanTopRankingLastMonth();
    if (alreadyRanTopRankingThisMonth) return;

    await this.achievementRepository.save({
      eventName: EventNameEnum.USER_REWARD_TOP_MONTH,
      badge,
      user: { id: user.userId },
      rule: { month: new Date().getMonth(), year: new Date().getFullYear() },
      completed: true,
      points: badge.points,
    });
  }

  private async alreadyRanTopRankingLastMonth(): Promise<boolean> {
    const response = await this.achievementRepository.checkIfHasTopRankForLastMonth();
    return response.length > 0;
  }
}
