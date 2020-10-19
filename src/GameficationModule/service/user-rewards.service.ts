import { Injectable } from '@nestjs/common';
import { AchievementRepository } from '../repository/achievement.repository';
import { StartEventShareCourseRuleDTO } from '../dto/start-event-share-course.dto';
import { Achievement } from '../entity/achievement.entity';
import { UserRepository } from '../../UserModule/repository/user.repository';
import { CourseTakenRepository } from '../../CourseModule/repository/course.taken.repository';
import { CourseRepository } from '../../CourseModule/repository/course.repository';
import { CourseTaken } from '../../CourseModule/entity/course.taken.entity';
import { CourseTakenStatusEnum } from '../../CourseModule/enum/enum';
import { EventNameEnum } from '../enum/event-name.enum';
import { BadgeRepository } from '../repository/badge.repository';
import PubSub from 'pubsub-js';
import { TestOnFirstTake } from './course-rewards.service';

interface SharedCourseRule {
  courseId: string;
}

@Injectable()
export class UserRewardsService {
  constructor(
    private readonly achievementRepository: AchievementRepository,
    private readonly badgeRepository: BadgeRepository,
    private readonly userRepository: UserRepository,
    private readonly courseRepository: CourseRepository,
    private readonly courseTakenRepository: CourseTakenRepository,
  ) {
    PubSub.subscribe(
      EventNameEnum.USER_REWARD_SHARE_COURSE,
      async (message: string, data: StartEventShareCourseRuleDTO) => {
        await this.shareCourseReward(data);
      },
    );
  }

  private async shareCourseReward({
    courseId,
    userId,
  }: StartEventShareCourseRuleDTO): Promise<void> {
    const [[user], [course]] = await Promise.all([
      this.userRepository.find({ where: { id: userId } }),
      this.courseRepository.find({ where: { id: courseId } }),
    ]);
    if (!user || !course) return;
    const courseTaken: CourseTaken = await this.courseTakenRepository.findByUserIdAndCourseId(
      user,
      course,
    );
    if (!courseTaken) return;

    if (
      courseTaken.status !== CourseTakenStatusEnum.COMPLETED ||
      courseTaken.completion !== 100
    )
      return;

    const [
      sharedCourse,
    ] = await this.achievementRepository.getSharedCourseByCourseIdAndUserId<
      Achievement<SharedCourseRule>
    >(courseId, userId);
    if (sharedCourse) return;

    const badge = await this.badgeRepository.findByEventNameAndOrder(
      EventNameEnum.USER_REWARD_SHARE_COURSE,
      1,
    );

    await this.achievementRepository.save({
      ...sharedCourse,
      user,
      badge,
      rule: { courseId },
    });
  }
}
