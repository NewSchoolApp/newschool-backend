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
import { UserLikedCommentRepository } from '../repository/user-liked-comment.repository';
import { UploadService } from '../../UploadModule/service/upload.service';
import { UserMapper } from '../../UserModule/mapper/user.mapper';
import { CommentDTO } from '../dto/comment.dto';
import { CommentMapper } from '../mapper/comment.mapper';

@Injectable()
export class CommentService {
  constructor(
    private readonly repository: CommentRepository,
    private readonly mapper: CommentMapper,
    private readonly userLikedCommentRepository: UserLikedCommentRepository,
    private readonly userService: UserService,
    private readonly partService: PartService,
    private readonly uploadService: UploadService,
    private readonly userMapper: UserMapper,
  ) {}

  public async findById(id: string): Promise<Comment> {
    const response: Comment[] = await this.repository.find({
      where: { id },
      relations: ['user', 'likedBy', 'part'],
    });
    if (!response.length) {
      throw new NotFoundException('Comment not found');
    }
    return response[0];
  }

  public async findPartComments(partId: string): Promise<Comment[]> {
    const part: Part = await this.partService.findById(partId);
    const comments = await this.repository.find({
      where: { part },
      relations: ['user', 'likedBy', 'part'],
    });
    return (await Promise.all(
      comments.map(({ id }) => this.mapComment(id)),
    )) as any;
  }

  public async getCommentResponses(id: string): Promise<Comment[]> {
    const comment = await this.findById(id);
    return this.mapComment(comment.id);
  }

  public async addComment(
    partId: string,
    userId: string,
    text: string,
  ): Promise<CommentDTO> {
    const [user, part]: [User, Part] = await Promise.all([
      this.userService.findById(userId),
      this.partService.findById(partId),
    ]);

    const comment: Comment = await this.repository.save({
      part,
      text,
      user,
    });

    return this.mapComment(comment.id);
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

    const savedResponse = await this.repository.save({
      user,
      part,
      text,
      parentComment: comment,
    });

    return this.mapResponse(savedResponse.id);
  }

  async mapComment(commentId: string): Promise<any> {
    const comment = await this.repository.findOne({
      where: { id: commentId },
      relations: ['user'],
    });
    const likes = await this.userLikedCommentRepository.find({
      where: { comment, user: comment.user },
      relations: ['user', 'comment'],
    });
    const responses = await this.repository.find({
      where: { parentComment: { id: commentId } },
      relations: ['likedBy'],
    });
    return {
      ...comment,
      user: await this.userMapper.toDtoAsync(comment.user),
      responses,
      likedBy: await Promise.all(
        likes.map(({ user }) => this.userMapper.toDtoAsync(user)),
      ),
    };
  }

  async mapResponse(responseId: string): Promise<any> {
    const response = await this.repository.findOne({
      where: { id: responseId },
      relations: ['user', 'parentComment'],
    });
    const parentComment = await this.repository.findOne({
      where: { id: response.parentComment.id },
      relations: ['user', 'responses'],
    });
    const parentCommentResponses = parentComment.responses.filter(
      (response) => response.id !== response.id,
    );
    const likes = await this.userLikedCommentRepository.find({
      where: { comment: response, user: response.user },
      relations: ['user', 'comment'],
    });
    return {
      ...response,
      parentComment: {
        ...parentComment,
        user: await this.userMapper.toDtoAsync(parentComment.user),
        responses: parentCommentResponses,
      },
      user: await this.userMapper.toDtoAsync(response.user),
      likedBy: await Promise.all(
        likes.map(({ user }) => this.userMapper.toDtoAsync(user)),
      ),
    };
  }
}
