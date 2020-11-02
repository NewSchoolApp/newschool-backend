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
import { NeedRole } from '../../CommonsModule/guard/role-metadata.guard';
import { RoleEnum } from '../../SecurityModule/enum/role.enum';
import { RoleGuard } from '../../CommonsModule/guard/role.guard';
import { OrderEnum } from '../../CommonsModule/enum/order.enum';
import { TimeRangeEnum } from '../enum/time-range.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RankingDTO } from '../dto/ranking.dto';
import { UserIdParam } from '../../CommonsModule/guard/student-metadata.guard';
import { StudentGuard } from '../../CommonsModule/guard/student.guard';

@ApiTags('Gamefication')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.GAMEFICATION_ENDPOINT}`,
)
export class GameficationController {
  constructor(private readonly service: GameficationService) {}

  @Post('start-event')
  @HttpCode(200)
  @NeedRole(RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public startEvent(@Body() body: StartEventDTO): void {
    this.service.startEvent(body.event, body.rule);
  }

  @Get('ranking')
  @NeedRole(RoleEnum.STUDENT, RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async getRanking(
    @Query('order') order: OrderEnum = OrderEnum.ASC,
    @Query('timeRange') timeRange: TimeRangeEnum = TimeRangeEnum.MONTH,
    @Query('institutionName') institutionName?: string,
    @Query('city') city?: string,
    @Query('state') state?: string,
  ): Promise<RankingDTO[]> {
    return await this.service.getRanking(
      order,
      timeRange,
      institutionName,
      city,
      state,
    );
  }

  @Get('ranking/user/:userId')
  @UserIdParam('userId')
  @UseGuards(StudentGuard)
  @NeedRole(RoleEnum.STUDENT, RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async getUserRanking(
    @Param('userId') userId: string,
    @Query('timeRange') timeRange: TimeRangeEnum = TimeRangeEnum.MONTH,
  ): Promise<RankingDTO> {
    return await this.service.getUserRanking(userId, timeRange);
  }
}
