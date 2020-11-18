import { Entity, ManyToOne } from 'typeorm';
import { User } from '../../UserModule/entity/user.entity';
import { Comment } from './comment.entity';
import { Audit } from '../../CommonsModule/entity/audit.entity';

@Entity()
export class UserHasComment extends Audit {
  @ManyToOne<User>(() => User, (user: User) => user.comments, { primary: true })
  user: User;

  @ManyToOne<Comment>(() => Comment, (comment: Comment) => comment.users, {
    primary: true,
  })
  comment: Comment;
}
