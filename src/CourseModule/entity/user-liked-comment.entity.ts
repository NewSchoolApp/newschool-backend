import { Column, Entity, JoinTable, ManyToOne } from 'typeorm';
import { User } from '../../UserModule/entity/user.entity';
import { Comment } from './comment.entity';
import { Audit } from '../../CommonsModule/entity/audit.entity';

@Entity()
export class UserLikedComment extends Audit {
  @ManyToOne<User>(() => User, (user: User) => user.likedComments, {
    primary: true,
  })
  @JoinTable({ name: 'userId' })
  user: User;

  @Column({ primary: true })
  userId: string;

  @ManyToOne<Comment>(() => Comment, (comment: Comment) => comment.likedBy, {
    primary: true,
  })
  @JoinTable({ name: 'commentId' })
  comment: Comment;

  @Column({ primary: true })
  commentId: string;

  @Column({ default: 0 })
  claps: number;
}
