import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Part } from './part.entity';
import { Expose } from 'class-transformer';
import { UserHasComment } from './user-has-comment.entity';
import { UserLikedComment } from './user-liked-comment.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @ManyToOne<Part>(() => Part, (part: Part) => part.comments, { eager: true })
  part: Part;

  @ManyToOne<Comment>(() => Comment, (comment: Comment) => comment.responses, {
    eager: true,
  })
  @Expose()
  parentComment: Comment;

  @OneToMany<Comment>(
    () => Comment,
    (comment: Comment) => comment.parentComment,
    { eager: true },
  )
  @Expose()
  responses: Comment[];

  @OneToMany<UserHasComment>(
    () => UserHasComment,
    (userHasComment: UserHasComment) => userHasComment.comment,
    { eager: true },
  )
  @JoinTable()
  users: UserHasComment[];

  @OneToMany<UserLikedComment>(
    () => UserLikedComment,
    (userLikedComment: UserLikedComment) => userLikedComment.comment,
    { eager: true },
  )
  @JoinTable()
  likedBy: UserLikedComment[];
}
