import { ApiProperty } from '@nestjs/swagger';
import { Part } from '../entity';

export class NewPartSwagger {
  @ApiProperty({ type: String })
  title: Part['title'];

  @ApiProperty({ type: String })
  description: Part['description'];

  @ApiProperty({ type: String })
  vimeoUrl: Part['vimeoUrl'];

  @ApiProperty({ type: String })
  youtubeURL: Part['youtubeUrl'];

  @ApiProperty({ type: String })
  lesson: Part['lesson'];
}
