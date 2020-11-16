import { EntityRepository, Repository } from 'typeorm';
import { Achievement } from '../entity/achievement.entity';
import { Test } from '../../CourseModule/entity/test.entity';
import { User } from '../../UserModule/entity/user.entity';
import { EventNameEnum } from '../enum/event-name.enum';
import { BadgeWithQuantityDTO } from '../dto/badge-with-quantity.dto';
import { OrderEnum } from '../../CommonsModule/enum/order.enum';
import { TimeRangeEnum } from '../enum/time-range.enum';
import { RankingDTO } from '../dto/ranking.dto';
import { RankingQueryDTO } from '../dto/ranking-query.dto';
import * as mysql from 'mysql';
import { Pageable, PageableDTO } from '../../CommonsModule/dto/pageable.dto';

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
        SELECT * from achievement WHERE userId = ? AND eventName = ? AND rule->>"$.testId" = ? ORDER BY version DESC
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
    socialMedia: string,
  ): Promise<Achievement<T>[]> {
    const params = [
      userId,
      EventNameEnum.USER_REWARD_SHARE_COURSE,
      courseId,
      socialMedia,
    ];
    const response: any[] = await this.query(
      `
        SELECT
          *
        FROM
          achievement
        WHERE
          userId = ?
        AND
          eventName = ?
        AND
          rule->>"$.courseId" = ?
        AND
          rule->>"$.platform" = ?
        ORDER BY
          version DESC
      `,
      params,
    );

    return response.map((achievement) => ({
      ...achievement,
      rule: JSON.parse(achievement.rule),
    }));
  }

  public async getNpsCourseAchievementByCourseIdAndUserIdAndBadgeId<T>(
    courseId: string,
    userId: string,
  ): Promise<Achievement<T>[]> {
    const params = [userId, EventNameEnum.COURSE_REWARD_COURSE_NPS, courseId];
    const response: any[] = await this.query(
      `
        SELECT
          *
        FROM
          achievement a
        INNER JOIN
          badge b
          ON
            a.badgeId = b.id
        WHERE
          a.userId = ?
        AND
          a.eventName = ?
        AND
          a.rule->>"$.courseId" = ?
        ORDER BY
          a.version DESC
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

  public async getRankingPaginated(
    order: OrderEnum,
    timeRange: TimeRangeEnum,
    limit: number,
    page: number,
    institutionName?: string,
    city?: string,
    state?: string,
  ): Promise<Pageable<RankingQueryDTO>> {
    const data = await this.getRanking(
      order,
      timeRange,
      limit,
      page,
      institutionName,
      city,
      state,
    );
    const totalElementsCount = await this.count();
    return new PageableDTO<RankingQueryDTO>({
      content: data,
      totalElements: totalElementsCount,
      limit,
      page,
    });
  }

  public async getRanking(
    order: OrderEnum,
    timeRange: TimeRangeEnum,
    limit: number,
    page: number,
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
    const limitQuery = `LIMIT ${mysql.escape(limit)} OFFSET ${mysql.escape(
      limit * (page - 1),
    )}`;
    let cityQuery = ``;
    let stateQuery = ``;

    if (institutionName) {
      institutionQuery = `
      and c2.institutionName = ${mysql.escape(institutionName)}
      `;
    }

    if (city) {
      cityQuery = `
      AND c2.city = ${mysql.escape(city)}
      `;
    }

    if (state) {
      stateQuery = `
      AND c2.state = ${mysql.escape(state)}
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
      ${limitQuery}
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

  public async getLastTimeRangeRanking(
    order: OrderEnum,
    timeRange: TimeRangeEnum,
    limit: number,
  ): Promise<RankingQueryDTO[]> {
    const timeRangeMethod =
      timeRange === TimeRangeEnum.MONTH ? 'MONTH' : 'YEAR';
    const timeRangeQuery = `
      AND ${timeRangeMethod}(a2.updatedAt) = ${timeRangeMethod}(CURRENT_DATE() - INTERVAL 1 ${timeRangeMethod})
    `;
    const limitQuery = `LIMIT ${mysql.escape(limit)}`;

    const derivedTable = `
    SELECT c2.id as 'userId', c2.name as 'userName', c2.photoPath as 'photoPath', SUM(b2.points) as 'points' FROM achievement a2
      inner join badge b2
      on a2.badgeId = b2.id
      inner join user c2
      on a2.userId = c2.id
      WHERE a2.completed = 1 ${timeRangeQuery}
      GROUP by a2.userId
      ${limitQuery}
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

  public checkIfHasTopRankForLastMonth(): Promise<any[]> {
    const lastTopMonthRankMonth =
      new Date().getMonth() === 0 ? 12 : new Date().getMonth();
    const lastTopMonthRankYear =
      new Date().getMonth() === 0
        ? new Date().getFullYear() - 1
        : new Date().getFullYear();
    return this.query(
      `
      SELECT
        *
      FROM
        achievement a
      WHERE
        eventName = ?
      AND
        a.completed = 1
      AND
        rule->>"$.month" = ?
      AND
        rule->>"$.year"
    `,
      [
        EventNameEnum.USER_REWARD_TOP_MONTH,
        lastTopMonthRankMonth,
        lastTopMonthRankYear,
      ],
    );
  }

  public sharedAppThisWeek(userId: string): Promise<any[]> {
    return this.query(
      `
      SELECT
        *
      FROM
        achievement a
      WHERE
        a.userId = ?
      AND
        eventName = ?
      AND
        a.completed = 1
      AND
        YEAR(a.updatedAt) = YEAR(CURRENT_DATE())
      AND
        WEEK(a.updatedAt) = WEEK(CURRENT_DATE())
    `,
      [userId, EventNameEnum.USER_REWARD_SHARE_APP],
    );
  }
}
