import { Injectable } from '@nestjs/common';
import { Test } from './../../CourseModule/entity/test.entity';
import { User } from './../../UserModule/entity/user.entity';
import { EventNameEnum } from '../enum/event-name.enum';
import { On } from '../pub-sub.decorator';
import { AchievementRepository } from '../repository/achievement.repository';

export interface TestOnFirstTake {
  chosenAlternative: string;
  user: User;
  test: Test;
}

interface CheckTest {
  [testId: string]: CheckTestRule[];
}

interface CheckTestRule {
  correctAlternative: string;
  chosenAlternative: string;
  timestamp: number;
}

@Injectable()
export class CourseRewardsService {
  constructor(private readonly achievementRepository: AchievementRepository) {}

  @On(EventNameEnum.COURSE_REWARD_TEST_ON_FIRST_TAKE)
  async checkTestReward(
    message: string,
    { chosenAlternative, test, user }: TestOnFirstTake,
  ): Promise<void> {
    let achievement = await this.achievementRepository.getTestOnFirstTakeAchivementByUser<
      CheckTest
    >(user);
    if (achievement.completed) return;
    const alreadyTriedThisTest =
      Object.keys(achievement.rule[test.id]).length > 0;

    const answerIsRight = chosenAlternative === test.correctAlternative;

    if (alreadyTriedThisTest || !answerIsRight) {
      achievement = {
        ...achievement,
        completed: false,
        rule: {
          ...achievement.rule,
          [test.id]: [
            ...(achievement.rule[test.id] || []),
            {
              correctAlternative: test.correctAlternative,
              chosenAlternative,
              timestamp: new Date().getTime(),
            },
          ],
        },
      };
      return;
    }

    achievement = {
      ...achievement,
      completed: true,
      rule: {
        ...achievement.rule,
        [test.id]: [
          ...(achievement.rule[test.id] || []),
          {
            correctAlternative: test.correctAlternative,
            chosenAlternative,
            timestamp: new Date().getTime(),
          },
        ],
      },
    };
  }
}
