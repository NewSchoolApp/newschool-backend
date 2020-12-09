import { EntityRepository, Repository } from 'typeorm';
import { Comment } from '../entity/comment.entity';

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
  public getCommentIds(partId, { order, orderBy }) {
    const orderByTranslation = {
      claps: 'totalClaps',
      createdAt: 'c.createdAt',
    };
    return this.query(
      `
        SELECT
          id,
          SUM(ulc.claps) as totalClaps
        FROM
          comment c
        LEFT JOIN
          user_liked_comment ulc
          ON
            ulc.commentId = c.id
        WHERE
          c.parentCommentId IS NULL
        AND
          c.partId = ${partId}
        GROUP BY
          c.id
        ORDER BY ${orderByTranslation[orderBy]} ${order}
      `,
    );
  }
}
