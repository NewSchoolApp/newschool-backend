import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Constants } from '../../CommonsModule/constants';
import { StartEventDTO } from '../dto/start-event.dto';
import { GameficationService } from '../service/gamefication.service';
import {
  NeedPolicies,
  NeedRoles,
} from '../../CommonsModule/decorator/role-guard-metadata.decorator';
import { RoleEnum } from '../../SecurityModule/enum/role.enum';
import { RoleGuard } from '../../CommonsModule/guard/role.guard';
import { OrderEnum } from '../../CommonsModule/enum/order.enum';
import { TimeRangeEnum } from '../enum/time-range.enum';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RankingDTO } from '../dto/ranking.dto';
import { UserIdParam } from '../../CommonsModule/guard/student-metadata.guard';
import { StudentGuard } from '../../CommonsModule/guard/student.guard';
import { Pageable } from '../../CommonsModule/dto/pageable.dto';
import { RankingQueryDTO } from '../dto/ranking-query.dto';
import { PageableRankingSwagger } from '../swagger/pageable-ranking.swagger';

@ApiTags('Gamefication')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.GAMEFICATION_ENDPOINT}`,
)
export class GameficationController {
  constructor(private readonly service: GameficationService) {}

  @Post('start-event')
  @HttpCode(200)
  @UseGuards(RoleGuard)
  @NeedRoles(RoleEnum.STUDENT)
  @NeedPolicies(`${Constants.POLICIES_PREFIX}/START_EVENT`)
  public startEvent(@Body() body: StartEventDTO): void {
    this.service.startEvent(body.event, body.rule);
  }

  @Get('ranking')
  @ApiOkResponse({ type: PageableRankingSwagger })
  @UseGuards(RoleGuard)
  @NeedRoles(RoleEnum.STUDENT, RoleEnum.ADMIN)
  @NeedPolicies(`${Constants.POLICIES_PREFIX}/GET_RANKING`)
  public async getRanking(
    @Query('order') order: OrderEnum = OrderEnum.ASC,
    @Query('timeRange') timeRange: TimeRangeEnum = TimeRangeEnum.MONTH,
    @Query('limit') limit = 10,
    @Query('page') page = 1,
    @Query('institutionName') institutionName?: string,
    @Query('city') city?: string,
    @Query('state') state?: string,
  ): Promise<Pageable<RankingQueryDTO>> {
    return await this.service.getRanking(
      order,
      timeRange,
      Number(limit),
      Number(page),
      institutionName,
      city,
      state,
    );
  }

  @Get('ranking/user/:userId')
  @UserIdParam('userId')
  //@UseGuards(StudentGuard)
  //@NeedRoles(RoleEnum.STUDENT, RoleEnum.ADMIN)
  //@NeedPolicies(
  //  `${Constants.POLICIES_PREFIX}/GET_RANKING`,
  //  '@EDUCATION-PLATFORM/GET-USER-RANKING',
  //)
  @UseGuards(RoleGuard)
  public async getUserRanking(
    @Param('userId') userId: string,
    @Query('timeRange') timeRange: TimeRangeEnum = TimeRangeEnum.MONTH,
    @Query('institutionName') institutionName?: string,
    @Query('city') city?: string,
    @Query('state') state?: string,
  ): Promise<RankingDTO> {
    return await this.service.getUserRanking(userId, {
      timeRange,
      institutionName,
      city,
      state,
    });
  }

  @Get('ranking/user/:userId/total-points')
  //@UseGuards(RoleGuard, StudentGuard)
  //@NeedRoles(RoleEnum.STUDENT, RoleEnum.ADMIN)
  //@NeedPolicies(`${Constants.POLICIES_PREFIX}/GET_USER_TOTAL_POINTS`)
  @UserIdParam('userId')
  public async getUserTotalPoints(
    @Param('userId') userId: string,
  ): Promise<RankingDTO | { userId: string; points: string }> {
    const userTotalPoints = await this.service.getUserTotalPoints(userId);
    return userTotalPoints || { userId, points: '0' };
  }
}
