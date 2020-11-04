import { EntityRepository, Repository } from 'typeorm';
import { Achievement } from '../entity/achievement.entity';
import { Test } from '../../CourseModule/entity/test.entity';
import { User } from '../../UserModule/entity/user.entity';
import { EventNameEnum } from '../enum/event-name.enum';
import { SocialMediaEnum } from '../dto/start-event-share-course.dto';
import { BadgeWithQuantityDTO } from '../dto/badge-with-quantity.dto';
import { OrderEnum } from '../../CommonsModule/enum/order.enum';
import { TimeRangeEnum } from '../enum/time-range.enum';
import { RankingDTO } from '../dto/ranking.dto';
import { RankingQueryDTO } from '../dto/ranking-query.dto';
import * as mysql from 'mysql';

@EntityRepository(Achievement)
export class AchievementRepository extends Repository<Achievement> {
  public async getTestOnFirstTakeByUserAndRuleTestId<T>(
    test: Test,
    user: User,
  ): Promise<Achievement<T>[]> {
    const params = [
      user.id,
      EventNameEnum.COURSE_REWARD_TEST_ON_FIRST_TAKE,
      test.id,
    ];
    const response: any[] = await this.query(
      `
        SELECT * from achievement WHERE userId = ? AND eventName = ? AND rule->>"$.testId" = ?
      `,
      params,
    );

    return response.map((achievement) => ({
      ...achievement,
      rule: JSON.parse(achievement.rule),
    }));
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
    const response: any[] = await this.query(
      `
        SELECT * from achievement WHERE userId = ? AND eventName = ? AND rule->>"$.courseId" = ? AND AND rule->>"$.platform" = ?
      `,
      params,
    );

    return response.map((achievement) => ({
      ...achievement,
      rule: JSON.parse(achievement.rule),
    }));
  }

  public async findByUserIdAndBadgeId(
    userId: string,
    badgeId: string,
  ): Promise<Achievement> {
    return this.findOne({
      where: { user: { id: userId }, badge: { id: badgeId } },
    });
  }

  public async findCompletedByUserIdAndBadgeId(
    userId: string,
    badgeId: string,
  ): Promise<Achievement> {
    return this.findOne({
      where: { user: { id: userId }, badge: { id: badgeId }, completed: true },
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

  public async getRanking(
    order: OrderEnum,
    timeRange: TimeRangeEnum,
    institutionName?: string,
    city?: string,
    state?: string,
  ): Promise<RankingQueryDTO[]> {
    let institutionQuery = ``;
    const timeRangeMethod =
      timeRange === TimeRangeEnum.MONTH ? 'MONTH' : 'YEAR';
    const timeRangeQuery = `
      AND ${timeRangeMethod}(a2.updatedAt) = ${timeRangeMethod}(CURRENT_DATE())
    `;
    let cityQuery = ``;
    let stateQuery = ``;

    if (institutionName) {
      institutionQuery = `
      and c2.institutionName = ${mysql.escape(city)}
      `;
    }

    if (city) {
      cityQuery = `
      and c2.city = ${mysql.escape(city)}
      `;
    }

    if (state) {
      stateQuery = `
      and c2.state = ${mysql.escape(state)}
      `;
    }

    const derivedTable = `
    SELECT c2.id as 'userId', c2.name as 'userName', c2.photoPath as 'photoPath', SUM(b2.points) as 'points' FROM achievement a2
      inner join badge b2
      on a2.badgeId = b2.id
      inner join user c2
      on a2.userId = c2.id
      WHERE a2.completed = 1 ${timeRangeQuery} ${institutionQuery} ${cityQuery} ${stateQuery}
      GROUP by a2.userId
    `;

    return this.query(
      `
    SELECT
      t.userId,
      t.userName,
      t.photoPath,
      t.points,
      1 + (
        SELECT
          count( * )
        FROM
          (${derivedTable})
        AS
          t2
        WHERE
          t2.points > t.points
      )
    AS
      rank
    FROM
      (${derivedTable})
    AS t ORDER BY t.points ${order}
    `,
    );
  }

  public async getUserRanking(
    userId: string,
    timeRange: TimeRangeEnum,
  ): Promise<RankingDTO> {
    const timeRangeMethod =
      timeRange === TimeRangeEnum.MONTH ? 'MONTH' : 'YEAR';
    const timeRangeQuery = `
      AND ${timeRangeMethod}(a2.updatedAt) = ${timeRangeMethod}(CURRENT_DATE())
    `;
    const params = [userId];
    const derivedTable = `
    SELECT c2.id as 'userId', c2.name as 'userName', SUM(b2.points) as 'points' FROM achievement a2
      inner join badge b2
      on a2.badgeId = b2.id
      inner join user c2
      on a2.userId = c2.id
      WHERE a2.completed = 1 ${timeRangeQuery}
      GROUP by a2.userId
      order by points DESC
    `;

    const response: RankingDTO[] = await this.query(
      `
    SELECT
      t.userId,
      t.userName,
      t.points,
      1 + (
        SELECT
          count( * )
        FROM
          (${derivedTable})
        AS
          t2
        WHERE
          t2.points > t.points
      )
    AS
      rank
    FROM
      (${derivedTable})
    AS t WHERE t.userId = ?
    `,
      params,
    );
    return response[0];
  }
}
