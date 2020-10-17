import { EntityRepository, Repository } from 'typeorm';
import { Achievement } from '../entity/achievement.entity';
import { Test } from '../../CourseModule/entity/test.entity';
import { User } from '../../UserModule/entity/user.entity';
import { EventNameEnum } from '../enum/event-name.enum';

@EntityRepository(Achievement)
export class AchievementRepository extends Repository<Achievement> {
  public getTestOnFirstTakeByUserAndRuleTestId<T>(
    test: Test,
    user: User,
  ): Promise<Achievement<T>[]> {
    const params = [
      user.id,
      EventNameEnum.COURSE_REWARD_TEST_ON_FIRST_TAKE,
      test.id,
    ];
    return this.query(
      `
        SELECT * from achievement WHERE userId = ? AND completed = 0 AND eventName= ? AND rule->>"$.testId" = ? AND rule->>"$.try" = < 4
      `,
      params,
    );
  }
}
