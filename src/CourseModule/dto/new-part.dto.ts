import { ApiProperty } from '@nestjs/swagger';
import { Part } from '../entity';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class NewPartDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Expose()
  title: Part['title'];

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Expose()
  description: Part['description'];

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Expose()
  lessonId: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Expose()
  vimeoUrl: Part['vimeoUrl'];

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Expose()
  youtubeUrl: Part['youtubeUrl'];
}
