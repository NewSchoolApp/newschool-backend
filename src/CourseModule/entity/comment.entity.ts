import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Part } from './part.entity';
import { User } from '../../UserModule/entity/user.entity';
import { Expose } from 'class-transformer';
import { UserHasComment } from './user-has-comment.entity';
import { UserLikedComment } from './user-liked-comment.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @ManyToOne<Part>(() => Part, (part: Part) => part.comments)
  part: Part;

  @ManyToOne<Comment>(() => Comment, (comment: Comment) => comment.responses)
  @Expose()
  parentComment: Comment;

  @OneToMany<Comment>(
    () => Comment,
    (comment: Comment) => comment.parentComment,
  )
  @Expose()
  responses: Comment[];

  @OneToMany<UserHasComment>(
    () => UserHasComment,
    (userHasComment: UserHasComment) => userHasComment.comment,
  )
  @JoinTable()
  users: UserHasComment[];

  @OneToMany<UserLikedComment>(
    () => UserLikedComment,
    (userLikedComment: UserLikedComment) => userLikedComment.comment,
  )
  @JoinTable()
  likedBy: User[];
}
