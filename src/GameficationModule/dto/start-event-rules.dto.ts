import { StartEventShareCourseRuleDTO } from './start-event-share-course.dto';
import { StartEventRateAppRuleDTO } from './start-event-rate-app.dto';

export type StartEventRules =
  | StartEventShareCourseRuleDTO
  | StartEventRateAppRuleDTO;
