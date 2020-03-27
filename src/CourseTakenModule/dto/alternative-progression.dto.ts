import { CurrentProgressionDTO } from './current-progression.dto';
import { AlternativeProgressionDataDTO } from './alternative-progression-data.dto';
import { Expose, Type } from 'class-transformer';
import { IsNotEmptyObject } from 'class-validator';

export class AlternativeProgressionDTO extends CurrentProgressionDTO {
  @IsNotEmptyObject()
  @Type(() => AlternativeProgressionDataDTO)
  @Expose()
  data: AlternativeProgressionDataDTO;
}
