import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Constants } from '../../CommonsModule/constants';
import { CommentService } from '../service/comment.service';
import { AddCommentDTO } from '../dto/add-comment.dto';
import { LikeCommentDTO } from '../dto/like-comment.dto';
import { CommentMapper } from '../mapper/comment.mapper';
import { CommentDTO } from '../dto/comment.dto';

@ApiTags('Comment')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.COMMENT_ENDPOINT}`,
)
export class CommentController {
  constructor(
    private readonly service: CommentService,
    private readonly mapper: CommentMapper,
  ) {}

  @Post()
  public async addComment(@Body() comment: AddCommentDTO): Promise<CommentDTO> {
    return this.mapper.toDto(
      await this.service.addComment(
        comment.partId,
        comment.userId,
        comment.text,
      ),
    );
  }

  @Get(':id/response')
  public async getCommentResponses(
    @Param('id') id: string,
  ): Promise<CommentDTO[]> {
    return this.mapper.toDtoList(await this.service.getCommentResponses(id));
  }

  @Post(':id/response')
  public async addCommentResponse(
    @Param('id') id: string,
    @Body() response: AddCommentDTO,
  ): Promise<CommentDTO> {
    return this.mapper.toDto(
      await this.service.addCommentResponse(
        id,
        response.partId,
        response.userId,
        response.text,
      ),
    );
  }

  @Get('part/:partId')
  public async getCommentsByPartId(
    @Param('partId') partId: string,
  ): Promise<CommentDTO[]> {
    return this.mapper.toDtoList(await this.service.findPartComments(partId));
  }

  @Post(':id/like')
  public async likeComment(
    @Param('id') id: string,
    @Body() body: LikeCommentDTO,
  ): Promise<void> {
    await this.service.likeComment(id, body.userId);
  }
}
