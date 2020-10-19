import { Injectable } from '@nestjs/common';
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

export interface SharedCourseRule {
  courseId: string;
}

@Injectable()
export class UserRewardsService {
  constructor(
    private readonly achievementRepository: AchievementRepository,
    private readonly badgeRepository: BadgeRepository,
    private readonly userService: UserService,
    private readonly courseService: CourseService,
    private readonly courseTakenService: CourseTakenService,
  ) {
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
}
