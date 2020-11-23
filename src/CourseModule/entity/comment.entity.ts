import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Part } from './part.entity';
import { Expose } from 'class-transformer';
import { UserLikedComment } from './user-liked-comment.entity';
import { User } from '../../UserModule/entity/user.entity';
import { Audit } from '../../CommonsModule/entity/audit.entity';

@Entity()
export class Comment extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  text: string;

  @Column({ nullable: false })
  partId: string;

  @ManyToOne<Comment>(() => Comment, (comment: Comment) => comment.responses)
  @Expose()
  parentComment: Comment;

  @OneToMany<Comment>(
    () => Comment,
    (comment: Comment) => comment.parentComment,
  )
  @Expose()
  responses: Comment[];

  @ManyToOne<User>(() => User, (user: User) => user.comments, {
    nullable: false,
  })
  user: User;

  @OneToMany<UserLikedComment>(
    () => UserLikedComment,
    (userLikedComment: UserLikedComment) => userLikedComment.comment,
  )
  @JoinTable()
  likedBy: UserLikedComment[];
}
