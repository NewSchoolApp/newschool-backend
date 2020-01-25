import { Part } from '../entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class PartDTO {
  @IsString()
  @Expose()
  @ApiProperty({ type: String })
  id: Part['id'];

  @IsString()
  @Expose()
  @ApiProperty({ type: String })
  title: Part['title'];

  @IsString()
  @Expose()
  @ApiProperty({ type: String })
  description: Part['description'];

  @IsString()
  @IsOptional()
  @Expose()
  @ApiProperty({ type: String })
  vimeoUrl: Part['vimeoUrl'];

  @IsString()
  @IsOptional()
  @Expose()
  @ApiProperty({ type: String })
  youtubeUrl: Part['youtubeUrl'];

  @IsString()
  @Expose()
  @ApiProperty({ type: String })
  lesson: Part['lesson'];

  @IsNumber()
  @Expose()
  @ApiProperty({ type: Number })
  sequenceNumber: Part['sequenceNumber'];
}
