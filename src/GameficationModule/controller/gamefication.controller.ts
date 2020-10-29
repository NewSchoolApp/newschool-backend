import {
  Body,
  Controller,
  Get,
  HttpCode,
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
import { getRankingUser } from '../interfaces/getRankingUser';
import { TimeFilterEnum } from '../enum/time-filter.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

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
    @Query('timeFilter') timeFilter: TimeFilterEnum = TimeFilterEnum.MONTH,
    @Query('institutionName') institutionName?: string,
    @Query('city') city?: string,
    @Query('state') state?: string,
  ): Promise<getRankingUser[]> {
    return await this.service.getRanking(
      order,
      timeFilter,
      institutionName,
      city,
      state,
    );
  }
}
