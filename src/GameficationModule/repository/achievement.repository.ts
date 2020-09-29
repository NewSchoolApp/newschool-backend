import { Badge } from '../entity/badge.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Achievement } from '../entity/achievement.entity';
import { Test } from '../../CourseModule/entity/test.entity';
import { User } from '../../UserModule/entity/user.entity';

@EntityRepository(Achievement)
export class AchievementRepository extends Repository<Achievement> {
  public getTestOnFirstTakeByUserAndBadgeAndRuleTestId<T>(
    test: Test,
    user: User,
    badge: Badge,
  ): Promise<Achievement<T>[]> {
    const params = [user.id, badge.id, test.id];
    return this.query(
      `
        SELECT * from achievement WHERE userId = ? AND badgeId = ? AND rule->>"$.testId" = ?
      `,
      params,
    );
  }
}
