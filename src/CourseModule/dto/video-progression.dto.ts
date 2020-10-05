import { CurrentProgressionDTO } from './current-progression.dto';
import { VideoProgressionDataDTO } from './video-progression-data.dto';

export class VideoProgressionDTO extends CurrentProgressionDTO {
  data: VideoProgressionDataDTO;
}
