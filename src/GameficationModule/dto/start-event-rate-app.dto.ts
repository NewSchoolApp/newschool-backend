import { StartEventDTO } from './start-event.dto';

export class StartEventRateAppRuleDTO {
  userId: string;
  rate: number;
}

export class StartEventRateAppDTO extends StartEventDTO {
  rule: StartEventRateAppRuleDTO;
}
