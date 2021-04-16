import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Constants } from '../../CommonsModule/constants';
import { CommentService } from '../service/v1/comment.service';
import { AddCommentDTO } from '../dto/add-comment.dto';
import { CommentDTO } from '../dto/comment.dto';
import { NeedPolicies, NeedRoles } from '../../CommonsModule/decorator/role-guard-metadata.decorator';
import { RoleEnum } from '../../SecurityModule/enum/role.enum';
import { RoleGuard } from '../../CommonsModule/guard/role.guard';
import { ResponseDTO } from '../dto/response.dto';
import { ClapCommentDTO } from '../dto/clap-comment.dto';
import { OrderEnum } from '../../CommonsModule/enum/order.enum';

@ApiTags('Comment')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.COMMENT_ENDPOINT}`,
)
export class CommentController {
  constructor(private readonly service: CommentService) {}

  @Post()
  @UseGuards(RoleGuard)
  @NeedRoles(RoleEnum.STUDENT)
  @NeedPolicies(`${Constants.POLICIES_PREFIX}/ADD_COMMENT`)
  public async addComment(@Body() comment: AddCommentDTO): Promise<CommentDTO> {
    return await this.service.addComment(
      comment.partId,
      comment.userId,
      comment.text,
    );
  }

  @Get(':id/response')
  @UseGuards(RoleGuard)
  @NeedRoles(RoleEnum.STUDENT)
  @NeedPolicies(`${Constants.POLICIES_PREFIX}/GET_COMMENT_RESPONSES`)
  public async getCommentResponses(
    @Param('id') id: string,
  ): Promise<CommentDTO> {
    return this.service.getCommentResponses(id);
  }

  @Post(':id/response')
  @UseGuards(RoleGuard)
  @NeedRoles(RoleEnum.STUDENT)
  @NeedPolicies(`${Constants.POLICIES_PREFIX}/ADD_COMMENT_RESPONSE`)
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
  @UseGuards(RoleGuard)
  @NeedRoles(RoleEnum.STUDENT)
  @NeedPolicies(`${Constants.POLICIES_PREFIX}/GET_COMMENTS_BY_PART_ID`)
  public async getCommentsByPartId(
    @Param('partId', ParseIntPipe) partId: number,
    @Query('order') order: OrderEnum = OrderEnum.DESC,
    @Query('orderBy') orderBy: 'claps' | 'createdAt' = 'claps',
  ): Promise<CommentDTO[]> {
    return await this.service.findPartComments(partId, { order, orderBy });
  }

  @Post(':id/clap')
  @UseGuards(RoleGuard)
  @NeedRoles(RoleEnum.STUDENT)
  @NeedPolicies(`${Constants.POLICIES_PREFIX}/CLAP_COMMENT`)
  public async clapComment(
    @Param('id') id: string,
    @Body() body: ClapCommentDTO,
  ): Promise<void> {
    await this.service.clapComment(id, body.userId, body.claps);
  }
}
