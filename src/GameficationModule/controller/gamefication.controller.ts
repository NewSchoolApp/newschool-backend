import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Constants } from '../../CommonsModule/constants';
import { StartEventDTO } from '../dto/start-event.dto';
import { GameficationService } from '../service/gamefication.service';

@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.GAMEFICATION_ENDPOINT}`,
)
export class GameficationController {
  constructor(private readonly service: GameficationService) {}

  @Post('start-event')
  @HttpCode(200)
  public startEvent(@Body() body: StartEventDTO) {
    this.service.startEvent(body.event, body.rule);
  }
}
