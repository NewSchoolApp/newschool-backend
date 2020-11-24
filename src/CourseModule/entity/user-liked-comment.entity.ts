import { Entity, ManyToOne } from 'typeorm';
import { User } from '../../UserModule/entity/user.entity';
import { Comment } from './comment.entity';
import { Audit } from '../../CommonsModule/entity/audit.entity';

@Entity()
export class UserLikedComment extends Audit {
  @ManyToOne<User>(() => User, (user: User) => user.likedComments, {
    primary: true,
  })
  user: User;

  @ManyToOne<Comment>(() => Comment, (comment: Comment) => comment.likedBy, {
    primary: true,
  })
  comment: Comment;
}
