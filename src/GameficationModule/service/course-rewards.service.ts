import { BadgeRepository } from '../repository/badge.repository';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Test } from '../../CourseModule/entity/test.entity';
import { User } from '../../UserModule/entity/user.entity';
import { EventNameEnum } from '../enum/event-name.enum';
import { AchievementRepository } from '../repository/achievement.repository';
import * as PubSub from 'pubsub-js';
import { CourseNpsRewardDTO } from '../dto/course-nps-reward.dto';
import { CourseTakenService } from '../../CourseModule/service/course.taken.service';
import { CourseTaken } from '../../CourseModule/entity/course.taken.entity';
import { Course } from 'src/CourseModule/entity/course.entity';
import { CompleteCourseRewardDTO } from '../dto/complete-course-reward.dto';
import { CourseTakenStatusEnum } from 'src/CourseModule/enum/enum';
import { CompleteCourseRewardDTO } from '../dto/complete-course-reward.dto';
import { CourseTakenService } from '../../CourseModule/service/course.taken.service';

export interface TestOnFirstTake {
  chosenAlternative: string;
  user: User;
  test: Test;
}

interface CheckTestRule {
  testId: string;
  try: number;
}

@Injectable()
export class CourseRewardsService implements OnModuleInit {
  constructor(
    private readonly achievementRepository: AchievementRepository,
    private readonly badgeRepository: BadgeRepository,
    private readonly courseTakenService: CourseTakenService,
  ) {}

  onModuleInit(): void {
    PubSub.subscribe(
      EventNameEnum.COURSE_REWARD_TEST_ON_FIRST_TAKE,
      async (message: string, data: TestOnFirstTake) => {
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
      async (message: string, data) => {
        this.completeCourseReward(data);
      },
    );
  }

  private async completeCourseReward({
    courseId,
    userId,
  }: CompleteCourseRewardDTO): Promise<void> {
    const { user } = await this.courseTakenService.findByUserIdAndCourseId(
      userId,
      courseId,
    );

    const completeCourse = this.courseTakenService.getCompletedByUserIdAndCourseId(
      userId,
      courseId,
    );

    if (!completeCourse) return;

    const badge = await this.badgeRepository.findByEventNameAndOrder(
      EventNameEnum.COURSE_REWARD_COMPLETE_COURSE,
      1,
    );

    await this.achievementRepository.save({
      user,
      badge,
      rule: { completion: 100, status: CourseTakenStatusEnum.COMPLETED },
      completed: true,
      eventName: EventNameEnum.COURSE_REWARD_COMPLETE_COURSE,
    });
  }

  private async checkTestReward({
    chosenAlternative,
    test,
    user,
  }: TestOnFirstTake): Promise<void> {
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
    ] = await this.achievementRepository.getTestOnFirstTakeByUserAndRuleTestId<
      CheckTestRule
    >(test, user);

    if (achievement?.completed) return;
    if (achievement?.rule?.try >= 4) return;

    if (!achievement) {
      achievement = {
        ...achievement,
        eventName: EventNameEnum.COURSE_REWARD_TEST_ON_FIRST_TAKE,
        completed: false,
        rule: {
          testId: test.id,
          try: 1,
        },
        user,
      };
    } else {
      achievement = {
        ...achievement,
        completed: false,
        rule: {
          ...achievement.rule,
          try: achievement.rule.try + 1,
        },
      };
    }

    const answerIsRight =
      chosenAlternative.toLowerCase() === test.correctAlternative.toLowerCase();

    if (!answerIsRight) return;

    const badge = await points[achievement.rule.try]();
    achievement = {
      ...achievement,
      completed: true,
      badge,
    };

    await this.achievementRepository.save(achievement);
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
    const badge = await this.badgeRepository.findByEventNameAndOrder(
      EventNameEnum.COURSE_REWARD_COURSE_NPS,
      1,
    );

    const achievement = await this.achievementRepository.findByUserIdAndBadgeId(
      userId,
      badge.id,
    );

    if (achievement) return;

    const courseTaken: CourseTaken = await this.courseTakenService.findCompletedWithRatingByUserIdAndCourseId(
      userId,
      courseId,
    );

    if (!courseTaken.rating) return;

    await this.achievementRepository.save({
      user: { id: userId },
      badge,
      eventName: EventNameEnum.COURSE_REWARD_COURSE_NPS,
      completed: true,
    });
  }
}
