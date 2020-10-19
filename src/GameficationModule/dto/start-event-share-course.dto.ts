import { StartEventDTO } from './start-event.dto';

export enum SocialMediaEnum {
  TWITTER = 'TWITTER',
  FACEBOOK = 'FACEBOOK',
}

export class StartEventShareCourseRuleDTO {
  courseId: string;
  userId: string;
  platform: SocialMediaEnum;
}

export class StartEventShareCourseDTO extends StartEventDTO {
  rule: StartEventShareCourseRuleDTO;
}
