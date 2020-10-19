import { Injectable } from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { StartEventRules } from '../dto/start-event-rules.dto';
import { StartEventEnum } from '../enum/start-event.enum';

@Injectable()
export class GameficationService {
  constructor(private readonly publisherService: PublisherService) {}

  startEvent(event: StartEventEnum, rule: StartEventRules) {
    this.publisherService.startEvent(event, rule);
  }
}
