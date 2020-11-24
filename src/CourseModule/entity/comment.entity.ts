import { User } from '../../UserModule/entity/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserLikedComment } from './user-liked-comment.entity';
import { Audit } from '../../CommonsModule/entity/audit.entity';
import { Expose } from 'class-transformer';

@Entity()
export class Comment extends Audit {
  @Column('varchar', { primary: true, name: 'id', length: 36 })
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

  @Column('varchar', { name: 'partId', length: 36 })
  partId: string;

  @ManyToOne(() => Comment, (comment) => comment.comments, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'parentCommentId', referencedColumnName: 'id' }])
  parentComment: Comment;

  @OneToMany(() => Comment, (comment) => comment.parentComment)
  comments: Comment[];

  @OneToMany(
    () => UserLikedComment,
    (userLikedComment) => userLikedComment.comment,
  )
  likedBy: UserLikedComment[];
}
