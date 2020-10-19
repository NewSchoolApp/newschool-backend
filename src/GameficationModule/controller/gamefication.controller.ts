import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Constants } from '../../CommonsModule/constants';
import { StartEventDTO } from '../dto/start-event.dto';
import { GameficationService } from '../service/gamefication.service';
import { UserRewardsService } from '../service/user-rewards.service';

@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.GAMEFICATION_ENDPOINT}`,
)
export class GameficationController {
  constructor(
    private readonly service: GameficationService,
    private readonly teste: UserRewardsService,
  ) {}

  @Post('start-event')
  @HttpCode(200)
  public startEvent(@Body() body: StartEventDTO) {
    this.service.startEvent(body.event, body.rule);
  }
}
