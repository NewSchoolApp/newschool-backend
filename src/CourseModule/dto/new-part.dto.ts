import { ApiProperty } from '@nestjs/swagger';
import { Part } from '../entity';
import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class NewPartDTO {
  @IsString()
  @Expose()
  @ApiProperty({ type: String })
  title: Part['title'];

  @IsString()
  @Expose()
  @ApiProperty({ type: String })
  description: Part['description'];

  @IsString()
  @Expose()
  @ApiProperty({ type: String })
  vimeoUrl: Part['vimeoUrl'];

  @IsString()
  @Expose()
  @ApiProperty({ type: String })
  youtubeUrl: Part['youtubeUrl'];

  @IsString()
  @Expose()
  @ApiProperty({ type: String })
  lesson: Part['lesson'];
}
