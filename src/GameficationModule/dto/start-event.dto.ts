import { StartEventEnum } from '../enum/start-event.enum';
import { StartEventRules } from './start-event-rules.dto';

export class StartEventDTO {
  event: StartEventEnum;
  rule: StartEventRules;
}
