import { CurrentProgressionDTO } from './current-progression.dto';
import { AlternativeProgressionDataDTO } from './alternative-progression-data.dto';

export class AlternativeProgressionDTO extends CurrentProgressionDTO {
  data: AlternativeProgressionDataDTO;
}
