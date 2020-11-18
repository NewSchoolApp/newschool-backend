import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentRepository } from '../repository/comment.repository';
import { UserService } from '../../UserModule/service/user.service';
import { PartService } from './part.service';
import { Comment } from '../entity/comment.entity';
import { User } from '../../UserModule/entity/user.entity';
import { Part } from '../entity/part.entity';
import { UserHasCommentRepository } from '../repository/user-has-comment.repository';
import { UserLikedCommentRepository } from '../repository/user-liked-comment.repository';

@Injectable()
export class CommentService {
  constructor(
    private readonly repository: CommentRepository,
    private readonly userHasCommentRepository: UserHasCommentRepository,
    private readonly userLikedCommentRepository: UserLikedCommentRepository,
    private readonly userService: UserService,
    private readonly partService: PartService,
  ) {}

  public async findById(id: string): Promise<Comment> {
    const response: Comment[] = await this.repository.find({
      where: { id },
      relations: ['users', 'likedBy'],
    });
    if (!response.length) {
      throw new NotFoundException('Comment not found');
    }
    return response[0];
  }

  public async findPartComments(partId: string): Promise<Comment[]> {
    const part: Part = await this.partService.findById(partId);
    return this.repository.find({
      where: { part },
      relations: ['users', 'likedBy'],
    });
  }

  public async getCommentResponses(id: string): Promise<Comment[]> {
    const parentComment: Comment = await this.findById(id);
    return this.repository.find({
      where: { parentComment },
      relations: ['users', 'likedBy'],
    });
  }

  public async addComment(
    partId: string,
    userId: string,
    text: string,
  ): Promise<Comment> {
    const [user, part]: [User, Part] = await Promise.all([
      this.userService.findById(userId),
      this.partService.findById(partId),
    ]);

    const comment: Comment = await this.repository.save({
      part,
      text,
    });

    await this.userHasCommentRepository.save({ user, comment });

    return comment;
  }

  public async likeComment(id: string, userId: string): Promise<void> {
    const [user, comment]: [User, Comment] = await Promise.all([
      this.userService.findById(userId),
      this.findById(id),
    ]);

    await this.userLikedCommentRepository.save({ user, comment });
  }

  public async addCommentResponse(
    id: string,
    partId: string,
    userId: string,
    text: string,
  ): Promise<Comment> {
    const [user, part, comment]: [User, Part, Comment] = await Promise.all([
      this.userService.findById(userId),
      this.partService.findById(partId),
      this.findById(id),
    ]);

    if (comment.parentComment)
      throw new BadRequestException('A response cannot have other responses');

    const response: Comment = await this.repository.save({
      part,
      text,
      parentComment: comment,
    });

    await this.userHasCommentRepository.save({ user, comment: response });

    return response;
  }
}
