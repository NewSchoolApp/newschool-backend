import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { Part } from '../entity/part.entity';

export class NewPartDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  title: Part['title'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  description: Part['description'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  lessonId: string;

  @IsOptional()
  @IsString()
  @Expose()
  vimeoUrl?: Part['vimeoUrl'];

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Expose()
  youtubeUrl?: Part['youtubeUrl'];
}
