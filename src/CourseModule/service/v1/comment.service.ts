import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from '../../repository/comment.repository';
import { UserService } from '../../../UserModule/service/user.service';
import { Comment } from '../../entity/comment.entity';
import { User } from '../../../UserModule/entity/user.entity';
import { UserLikedCommentRepository } from '../../repository/user-liked-comment.repository';
import { UploadService } from '../../../UploadModule/service/upload.service';
import { UserMapper } from '../../../UserModule/mapper/user.mapper';
import { CommentDTO } from '../../dto/comment.dto';
import { CommentMapper } from '../../mapper/comment.mapper';
import { ResponseDTO } from '../../dto/response.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly repository: CommentRepository,
    private readonly mapper: CommentMapper,
    private readonly userLikedCommentRepository: UserLikedCommentRepository,
    private readonly userService: UserService,
    private readonly uploadService: UploadService,
    private readonly userMapper: UserMapper,
  ) {}

  public async findById(id: string): Promise<Comment> {
    const response: Comment[] = await this.repository.find({
      where: { id },
      relations: ['user', 'likedBy', 'parentComment'],
    });
    if (!response.length) {
      throw new NotFoundException('Comment not found');
    }
    return response[0];
  }

  public async findPartComments(
    partId: number,
    { order, orderBy },
  ): Promise<CommentDTO[]> {
    const comments: any[] = await this.repository.getCommentIds(partId, {
      order,
      orderBy,
    });
    return await Promise.all(comments.map(({ id }) => this.mapComment(id)));
  }

  public async getCommentResponses(id: string): Promise<CommentDTO> {
    const comment = await this.findById(id);
    return this.mapComment(comment.id);
  }

  public async addComment(
    partId: number,
    userId: string,
    text: string,
  ): Promise<CommentDTO> {
    const user: User = await this.userService.findById(userId);

    const comment: Comment = await this.repository.save({
      partId,
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

  public async clapComment(
    id: string,
    userId: string,
    claps: number,
  ): Promise<void> {
    const userLikedCommentResponse = await this.userLikedCommentRepository.find(
      {
        where: { userId, commentId: id },
      },
    );

    let userLikedComment = userLikedCommentResponse[0];

    if (!userLikedComment) {
      userLikedComment = {
        ...userLikedComment,
        userId,
        commentId: id,
      };
    }

    const allClaps =
      claps + userLikedComment.claps > 50
        ? 50
        : claps + (userLikedComment.claps ?? 0);

    await this.userLikedCommentRepository.save({
      ...userLikedComment,
      claps: allClaps,
    });
  }

  public async addCommentResponse(
    id: string,
    partId: number,
    userId: string,
    text: string,
  ): Promise<ResponseDTO> {
    const [user, comment]: [User, Comment] = await Promise.all([
      this.userService.findById(userId),
      this.findById(id),
    ]);

    if (comment.parentComment)
      throw new BadRequestException('A response cannot have other responses');

    const savedResponse = await this.repository.save({
      user,
      partId,
      text,
      parentComment: comment,
    });

    return this.mapResponse(savedResponse.id);
  }

  async mapComment(commentId: string): Promise<CommentDTO> {
    const comment = await this.repository.findOne({
      where: { id: commentId },
      relations: ['user'],
    });
    const userLikedComments = await this.userLikedCommentRepository.find({
      where: { commentId },
      relations: ['user'],
    });
    const responses = await this.repository.find({
      where: { parentComment: { id: commentId } },
      relations: ['user', 'likedBy', 'likedBy.user'],
    });
    const mappedResponses = await Promise.all(
      responses.map(async (response) => {
        return {
          ...response,
          user: await this.userMapper.toDtoAsync(response.user),
          clappedByTotalCount: response.likedBy.reduce(
            (acc, { claps }) => acc + claps,
            0,
          ),
          clappedBy: await Promise.all(
            response.likedBy.map(async ({ user, claps }) => ({
              user: await this.userMapper.toDtoAsync(user),
              claps,
            })),
          ),
        };
      }),
    );
    return {
      ...comment,
      user: await this.userMapper.toDtoAsync(comment.user),
      responses: mappedResponses,
      clappedByTotalCount: userLikedComments.reduce(
        (acc, { claps }) => acc + claps,
        0,
      ),
      clappedBy: await Promise.all(
        userLikedComments.map(async ({ user, claps }) => ({
          user: await this.userMapper.toDtoAsync(user),
          claps,
        })),
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
      relations: [
        'user',
        'responses',
        'likedBy',
        'likedBy.user',
        'responses.user',
        'responses.likedBy',
      ],
    });
    const parentCommentResponses = await Promise.all(
      parentComment.responses
        .filter((response) => response.id !== response.id)
        .map(async (response) => {
          return {
            ...response,
            // user: await this.userMapper.toDtoAsync(response.user),
            clappedByTotalCount: response.likedBy.reduce(
              (acc, { claps }) => acc + claps,
              0,
            ),
            clappedBy: await Promise.all(
              response.likedBy.map(async ({ user, claps }) => ({
                user: await this.userMapper.toDtoAsync(user),
                claps,
              })),
            ),
          };
        }),
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
        clappedByTotalCount: parentComment.likedBy.reduce(
          (acc, { claps }) => acc + claps,
          0,
        ),
        clappedBy: await Promise.all(
          parentComment.likedBy.map(async ({ user, claps }) => ({
            user: await this.userMapper.toDtoAsync(user),
            claps,
          })),
        ),
      },
      user: await this.userMapper.toDtoAsync(response.user),
      clappedByTotalCount: likes.reduce((acc, { claps }) => acc + claps, 0),
      clappedBy: await Promise.all(
        likes.map(async ({ user, claps }) => ({
          user: await this.userMapper.toDtoAsync(user),
          claps,
        })),
      ),
    };
  }
}
