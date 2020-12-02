import { EntityRepository, Repository } from 'typeorm';
import { UserLikedComment } from '../entity/user-liked-comment.entity';

@EntityRepository(UserLikedComment)
export class UserLikedCommentRepository extends Repository<UserLikedComment> {}
