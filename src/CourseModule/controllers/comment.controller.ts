import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Constants } from '../../CommonsModule/constants';
import { CommentService } from '../service/v1/comment.service';
import { AddCommentDTO } from '../dto/add-comment.dto';
import { LikeCommentDTO } from '../dto/like-comment.dto';
import { CommentDTO } from '../dto/comment.dto';
import { NeedRole } from '../../CommonsModule/guard/role-metadata.guard';
import { RoleEnum } from '../../SecurityModule/enum/role.enum';
import { RoleGuard } from '../../CommonsModule/guard/role.guard';
import { ResponseDTO } from '../dto/response.dto';
import { ClapCommentDTO } from '../dto/clap-comment.dto';

@ApiTags('Comment')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.COMMENT_ENDPOINT}`,
)
export class CommentController {
  constructor(private readonly service: CommentService) {}

  @Post()
  @NeedRole(RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async addComment(@Body() comment: AddCommentDTO): Promise<CommentDTO> {
    return await this.service.addComment(
      comment.partId,
      comment.userId,
      comment.text,
    );
  }

  @Get(':id/response')
  @NeedRole(RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async getCommentResponses(
    @Param('id') id: string,
  ): Promise<CommentDTO> {
    return this.service.getCommentResponses(id);
  }

  @Post(':id/response')
  @NeedRole(RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async addCommentResponse(
    @Param('id') id: string,
    @Body() response: AddCommentDTO,
  ): Promise<ResponseDTO> {
    return await this.service.addCommentResponse(
      id,
      response.partId,
      response.userId,
      response.text,
    );
  }

  @Get('part/:partId')
  @NeedRole(RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async getCommentsByPartId(
    @Param('partId', ParseIntPipe) partId: number,
  ): Promise<CommentDTO[]> {
    return await this.service.findPartComments(partId);
  }

  @Post(':id/like')
  @NeedRole(RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async likeComment(
    @Param('id') id: string,
    @Body() body: LikeCommentDTO,
  ): Promise<void> {
    await this.service.likeComment(id, body.userId);
  }

  @Post(':id/clap')
  @NeedRole(RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async clapComment(
    @Param('id') id: string,
    @Body() body: ClapCommentDTO,
  ): Promise<void> {
    await this.service.clapComment(id, body.userId, body.claps);
  }
}
