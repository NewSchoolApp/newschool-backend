import { BadgeRepository } from '../repository/badge.repository';
import { Injectable } from '@nestjs/common';
import { Test } from '../../CourseModule/entity/test.entity';
import { User } from '../../UserModule/entity/user.entity';
import { EventNameEnum } from '../enum/event-name.enum';
import { AchievementRepository } from '../repository/achievement.repository';
import * as PubSub from 'pubsub-js';
import { PusherService } from './pusher.service';

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
export class CourseRewardsService {
  constructor(
    private readonly achievementRepository: AchievementRepository,
    private readonly badgeRepository: BadgeRepository,
    private readonly pusherService: PusherService,
  ) {
    PubSub.subscribe(
      EventNameEnum.COURSE_REWARD_TEST_ON_FIRST_TAKE,
      (message: string, data: TestOnFirstTake) => {
        this.checkTestReward(data);
      },
    );
  }

  async checkTestReward({
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
}
