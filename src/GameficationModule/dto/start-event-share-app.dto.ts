import { StartEventDTO } from './start-event.dto';

export enum SocialMediaEnum {
  TWITTER = 'TWITTER',
  FACEBOOK = 'FACEBOOK',
}

export class StartEventShareAppRuleDTO {
  userId: string;
  platform: SocialMediaEnum;
}

export class StartEventShareAppDTO extends StartEventDTO {
  rule: StartEventShareAppRuleDTO;
}
