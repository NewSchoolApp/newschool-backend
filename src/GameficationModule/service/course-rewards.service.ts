import { BadgeRepository } from '../repository/badge.repository';
import { Injectable } from '@nestjs/common';
import { Test } from '../../CourseModule/entity/test.entity';
import { User } from '../../UserModule/entity/user.entity';
import { EventNameEnum } from '../enum/event-name.enum';
import { AchievementRepository } from '../repository/achievement.repository';
import slugify from 'slugify';
import * as PubSub from 'pubsub-js';
import { PusherService } from './pusher.service';
import { ChannelEventEnum } from '../enum/channel-event.enum';

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
    const pontuation = {
      1: 10,
      2: 5,
      3: 2,
      4: 1,
    };
    const badge = await this.badgeRepository.findBySlug(slugify('De primeira'));
    let [
      achievement,
    ] = await this.achievementRepository.getTestOnFirstTakeByUserAndBadgeAndRuleTestId<
      CheckTestRule
    >(test, user, badge);

    if (achievement?.completed) return;
    if (achievement?.rule?.try > 4) return;

    if (!achievement) {
      achievement = {
        ...achievement,
        completed: false,
        points: 0,
        rule: {
          testId: test.id,
          try: 1,
        },
        badge,
        user,
      };
    } else {
      achievement = {
        ...achievement,
        completed: false,
        points: 0,
        rule: {
          ...achievement.rule,
          try: achievement.rule.try + 1,
        },
      };
    }

    const answerIsRight =
      chosenAlternative.toLowerCase() === test.correctAlternative.toLowerCase();

    const points = pontuation[achievement.rule.try] ?? 0;

    achievement = {
      ...achievement,
      completed: true,
      points: answerIsRight ? points : 0,
    };

    if (answerIsRight) {
      this.pusherService.postMessageToUser(
        user.id,
        ChannelEventEnum.GAMEFICATION,
        achievement,
      );
    }

    await this.achievementRepository.save(achievement);
  }
}
