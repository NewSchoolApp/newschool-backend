import { BadgeRepository } from '../repository/badge.repository';
import { Injectable } from '@nestjs/common';
import { Test } from '../../CourseModule/entity/test.entity';
import { User } from '../../UserModule/entity/user.entity';
import { EventNameEnum } from '../enum/event-name.enum';
import { AchievementRepository } from '../repository/achievement.repository';
import slugify from 'slugify';
import * as PubSub from 'pubsub-js';

export interface TestOnFirstTake {
  chosenAlternative: string;
  user: User;
  test: Test;
}

interface CheckTestRule {
  correctAlternative: string;
  chosenAlternative: string;
  testId: string;
}

@Injectable()
export class CourseRewardsService {
  constructor(
    private readonly achievementRepository: AchievementRepository,
    private readonly badgeRepository: BadgeRepository,
  ) {
    PubSub.subscribe(
      EventNameEnum.COURSE_REWARD_TEST_ON_FIRST_TAKE,
      (...args) => {
        // @ts-ignore
        this.checkTestReward(...args);
      },
    );
  }

  async checkTestReward(
    message: string,
    { chosenAlternative, test, user }: TestOnFirstTake,
  ): Promise<void> {
    const badge = await this.badgeRepository.findBySlug(slugify('De primeira'));
    let [
      achievement,
    ] = await this.achievementRepository.getTestOnFirstTakeByUserAndBadgeAndRuleTestId<
      CheckTestRule
    >(test, user, badge);
    if (achievement) return;

    const answerIsRight =
      chosenAlternative.toLowerCase() === test.correctAlternative.toLowerCase();

    achievement = {
      ...achievement,
      completed: answerIsRight,
      rule: {
        testId: test.id,
        correctAlternative: test.correctAlternative,
        chosenAlternative,
      },
    };
    await this.achievementRepository.save(achievement);
  }
}
