import { StartEventDTO } from './start-event.dto';

export class StartEventShareAppRuleDTO {
  userId: string;
  platform: string;
}

export class StartEventShareAppDTO extends StartEventDTO {
  rule: StartEventShareAppRuleDTO;
}
