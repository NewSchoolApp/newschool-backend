import { StartEventEnum } from '../enum/start-event.enum';
import { StartEventRules } from './start-event-rules.dto';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class StartEventDTO {
  @IsNotEmpty()
  @IsEnum(StartEventEnum)
  event: StartEventEnum;

  @IsOptional()
  rule?: StartEventRules;
}
