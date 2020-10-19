import { IsEnum, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { StepEnum } from '../enum/step.enum';

export class CurrentProgressionDTO {
  @IsNotEmpty()
  @IsEnum(StepEnum)
  @Expose()
  type: StepEnum;
}
