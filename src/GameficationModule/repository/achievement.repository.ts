import { Badge } from './../entity/badge.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Achievement } from './../entity/achievement.entity';
import { Test } from './../../CourseModule/entity/test.entity';
import { User } from '../../UserModule/entity/user.entity';

@EntityRepository(Achievement)
export class AchievementRepository extends Repository<Achievement<any>> {
  public getTestOnFirstTakeByUserAndBadgeAndRuleTestId<T>(
    test: Test,
    user: User,
    badge: Badge,
  ): Promise<Achievement<T>> {
    const params = [test.id, user.id, badge.id];
    return this.query(
      `
        SELECT rule->"[?]" from achievement WHERE user_id = ? AND badge_id = ?
      `,
      params,
    );
  }
}
