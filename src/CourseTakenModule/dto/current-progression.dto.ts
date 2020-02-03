import { StepEnum } from '../enum';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class CurrentProgressionDTO {
  @IsNotEmpty()
  @IsEnum(StepEnum)
  @Expose()
  type: StepEnum;
}
