import { EntityRepository, Repository } from 'typeorm';
import { UserHasComment } from '../entity/user-has-comment.entity';

@EntityRepository(UserHasComment)
export class UserHasCommentRepository extends Repository<UserHasComment> {}
