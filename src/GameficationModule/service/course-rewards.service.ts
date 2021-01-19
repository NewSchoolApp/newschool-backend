import { BadgeRepository } from '../repository/badge.repository';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventNameEnum } from '../enum/event-name.enum';
import { AchievementRepository } from '../repository/achievement.repository';
import * as PubSub from 'pubsub-js';
import { CourseTaken } from '../../CourseModule/entity/course-taken.entity';
import { CourseTakenStatusEnum } from '../../CourseModule/enum/course-taken-status.enum';
import { CompleteCourseRewardDTO } from '../dto/complete-course-reward.dto';
import { CourseNpsRewardDTO } from '../dto/course-nps-reward.dto';
import { CourseTakenRepository } from '../../CourseModule/repository/course.taken.repository';
import { Achievement } from '../entity/achievement.entity';
import { CMSTestDTO } from '../../CourseModule/dto/cms-test.dto';
import { Badge } from '../entity/badge.entity';

export interface TestTry {
  chosenAlternative: string;
  userId: string;
  test: CMSTestDTO;
}

interface CheckTestRule {
  testId: number;
  try: number;
}

@Injectable()
export class CourseRewardsService implements OnModuleInit {
  constructor(
    private readonly achievementRepository: AchievementRepository,
    private readonly badgeRepository: BadgeRepository,
    private readonly courseTakenRepository: CourseTakenRepository,
  ) {}

  onModuleInit(): void {
    PubSub.subscribe(
      EventNameEnum.COURSE_REWARD_TEST_ON_FIRST_TAKE,
      async (message: string, data: TestTry) => {
        await this.checkTestReward(data);
      },
    );
    PubSub.subscribe(
      EventNameEnum.COURSE_REWARD_COURSE_NPS,
      async (message: string, data: CourseNpsRewardDTO) => {
        await this.courseNpsReward(data);
      },
    );
    PubSub.subscribe(
      EventNameEnum.COURSE_REWARD_COMPLETE_COURSE,
      async (message: string, data: CompleteCourseRewardDTO) => {
        await this.completeCourseReward(data);
      },
    );
  }

  private async completeCourseReward({
    courseId,
    userId,
  }: CompleteCourseRewardDTO): Promise<void> {
    const completedCourse = await this.courseTakenRepository.getCompletedByUserIdAndCourseId(
      userId,
      courseId,
    );

    if (!completedCourse) return;

    const badge = await this.badgeRepository.findByEventNameAndOrder(
      EventNameEnum.COURSE_REWARD_COMPLETE_COURSE,
      1,
    );

    await this.achievementRepository.save({
      user: completedCourse.user,
      badge,
      rule: { completion: 100, status: CourseTakenStatusEnum.COMPLETED },
      completed: true,
      eventName: EventNameEnum.COURSE_REWARD_COMPLETE_COURSE,
      points: badge.points,
    });
  }

  private async checkTestReward({
    chosenAlternative,
    test,
    userId,
  }: TestTry): Promise<void> {
    const points = {
      1: () =>
        this.badgeRepository.findByEventNameAndOrder(
          EventNameEnum.COURSE_REWARD_TEST_ON_FIRST_TAKE,
          1,
        ),
      2: () =>
        this.badgeRepository.findByEventNameAndOrder(
          EventNameEnum.COURSE_REWARD_TEST_ON_FIRST_TAKE,
          2,
        ),
      3: () =>
        this.badgeRepository.findByEventNameAndOrder(
          EventNameEnum.COURSE_REWARD_TEST_ON_FIRST_TAKE,
          3,
        ),
      4: () =>
        this.badgeRepository.findByEventNameAndOrder(
          EventNameEnum.COURSE_REWARD_TEST_ON_FIRST_TAKE,
          4,
        ),
    };
    let [
      achievement,
    ]: Achievement<CheckTestRule>[] = await this.achievementRepository.getTestOnFirstTakeByUserIdAndRuleTestId<CheckTestRule>(
      test.id,
      userId,
    );

    if (achievement?.completed) return;

    if (!achievement) {
      achievement = {
        ...achievement,
        rule: {
          testId: test.id,
          try: 1,
        },
      };
    } else {
      achievement = {
        ...achievement,
        rule: {
          ...achievement.rule,
          try: achievement.rule.try + 1,
        },
      };
    }

    const answerIsRight =
      chosenAlternative.toLowerCase() === test.alternativa_certa.toLowerCase();

    const badge: Badge = await points[
      achievement.rule.try > 4 ? 4 : achievement.rule.try
    ]();

    await this.achievementRepository.save({
      ...achievement,
      eventName: EventNameEnum.COURSE_REWARD_TEST_ON_FIRST_TAKE,
      completed: answerIsRight,
      badge: answerIsRight ? badge : null,
      user: { id: userId },
      points: badge.points,
    });
  }

  async courseNpsReward({
    userId,
    courseId,
  }: CourseNpsRewardDTO): Promise<void> {
    /*
     * Evento para verificar se o usuário avaliou o curso
     * Ele deve ganhar os pontos apenas se:
     * 1- Se ele está no curso
     * 2- Se ele finalizou o curso
     * 3- Se ele ainda não ganhou os pontos dessa gameficação
     * */

    const [
      achievement,
    ] = await this.achievementRepository.getNpsCourseAchievementByCourseIdAndUserIdAndBadgeId(
      courseId,
      userId,
    );

    if (achievement) return;

    const badge = await this.badgeRepository.findByEventNameAndOrder(
      EventNameEnum.COURSE_REWARD_COURSE_NPS,
      1,
    );

    if (!badge) return;

    const courseTaken: CourseTaken = await this.courseTakenRepository.findCompletedWithRatingByUserIdAndCourseId(
      userId,
      courseId,
    );

    if (!courseTaken) return;

    await this.achievementRepository.save({
      user: { id: userId },
      badge,
      rule: { courseId },
      eventName: EventNameEnum.COURSE_REWARD_COURSE_NPS,
      completed: true,
      points: badge.points,
    });
  }
}
