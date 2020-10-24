import { EntityRepository, Repository } from 'typeorm';
import { Achievement } from '../entity/achievement.entity';
import { Test } from '../../CourseModule/entity/test.entity';
import { User } from '../../UserModule/entity/user.entity';
import { EventNameEnum } from '../enum/event-name.enum';
import { SocialMediaEnum } from '../dto/start-event-share-course.dto';
import { BadgeWithQuantityDTO } from '../dto/badge-with-quantity.dto';

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
        SELECT * from achievement WHERE userId = ? AND eventName = ? AND rule->>"$.testId" = ?
      `,
      params,
    );
  }

  public async getSharedCourseByCourseIdAndUserIdAndSocialMedia<T>(
    courseId: string,
    userId: string,
    socialMedia: SocialMediaEnum,
  ): Promise<Achievement<T>[]> {
    const params = [
      userId,
      EventNameEnum.USER_REWARD_SHARE_COURSE,
      courseId,
      socialMedia,
    ];
    return this.query(
      `
        SELECT * from achievement WHERE userId = ? AND eventName = ? AND rule->>"$.courseId" = ? AND AND rule->>"$.platform" = ?
      `,
      params,
    );
  }

  public async findByUserIdAndBadgeId(
    userId: string,
    badgeId: string,
  ): Promise<Achievement> {
    return this.findOne({
      where: { user: { id: userId }, badge: { id: badgeId } },
    });
  }

  public async findBadgesCountByUserId(
    userId: string,
  ): Promise<BadgeWithQuantityDTO[]> {
    const params = [userId];
    return this.query(
      `
    SELECT
      b.*,
      count(b.id) as quantity
    FROM
      achievement a
    INNER JOIN
      badge b
    ON
      a.badgeId = b.id
    WHERE
      a.userId = ?
    AND
      a.completed = 1
    GROUP BY
      b.id`,
      params,
    );
  }

  public async countAchievementsByBadgeId(badgeId: string): Promise<number> {
    return this.count({ where: { badge: { id: badgeId } } });
  }

  public async countAchievementsByEventName(
    eventName: EventNameEnum,
  ): Promise<number> {
    return this.count({ where: { eventName } });
  }
}
