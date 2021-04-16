import { User } from '../../UserModule/entity/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserLikedComment } from './user-liked-comment.entity';
import { Audit } from '../../CommonsModule/entity/audit.entity';
import { Expose } from 'class-transformer';

@Entity()
export class Comment extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { name: 'text', length: 255 })
  text: string;

  @ManyToOne<User>('User')
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
  })
  @Expose()
  user: User;

  @Column('varchar', { name: 'userId', length: 36 })
  userId: string;

  @Column('int', { name: 'partId' })
  partId: number;

  @ManyToOne(() => Comment, (comment) => comment.responses)
  @JoinColumn([{ name: 'parentCommentId', referencedColumnName: 'id' }])
  parentComment?: Comment;

  @Column('varchar', { name: 'parentCommentId', length: 36, nullable: true })
  parentCommentId: string;

  @OneToMany(() => Comment, (comment) => comment.parentComment)
  responses: Comment[];

  @OneToMany(
    () => UserLikedComment,
    (userLikedComment) => userLikedComment.comment,
  )
  likedBy: UserLikedComment[];
}
