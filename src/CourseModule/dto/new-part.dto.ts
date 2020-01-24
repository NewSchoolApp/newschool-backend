import { ApiModelProperty } from '@nestjs/swagger';
import { Part } from '../entity';
import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class NewPartDTO {
  @IsString()
  @Expose()
  @ApiModelProperty({ type: String })
  title: Part['title'];

  @IsString()
  @Expose()
  @ApiModelProperty({ type: String })
  description: Part['description'];

  @IsString()
  @Expose()
  @ApiModelProperty({ type: String })
  vimeoUrl: Part['vimeoUrl'];

  @IsString()
  @Expose()
  @ApiModelProperty({ type: String })
  youtubeUrl: Part['youtubeUrl'];

  @IsString()
  @Expose()
  @ApiModelProperty({ type: String })
  lesson: Part['lesson'];
}
