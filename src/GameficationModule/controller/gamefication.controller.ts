import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { Constants } from '../../CommonsModule/constants';
import { StartEventDTO } from '../dto/start-event.dto';
import { GameficationService } from '../service/gamefication.service';
import { NeedRole } from '../../CommonsModule/guard/role-metadata.guard';
import { RoleEnum } from '../../SecurityModule/enum/role.enum';
import { RoleGuard } from '../../CommonsModule/guard/role.guard';

@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.GAMEFICATION_ENDPOINT}`,
)
export class GameficationController {
  constructor(private readonly service: GameficationService) {}

  @Post('start-event')
  @HttpCode(200)
  @NeedRole(RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public startEvent(@Body() body: StartEventDTO) {
    this.service.startEvent(body.event, body.rule);
  }
}
