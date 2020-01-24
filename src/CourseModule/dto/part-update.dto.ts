import { ApiProperty } from '@nestjs/swagger';
import { Part } from '../entity';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class PartUpdateDTO {
  @IsString()
  @Expose()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  title: Part['title'];

  @IsString()
  @Expose()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  description: Part['description'];

  @IsString()
  @Expose()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  vimeoUrl: Part['vimeoUrl'];

  @IsString()
  @Expose()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  youtubeUrl: Part['youtubeUrl'];

  @IsString()
  @Expose()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  lesson: Part['lesson'];

  @IsNumber()
  @Expose()
  @IsNotEmpty()
  @ApiProperty({ type: Number })
  sequenceNumber: Part['sequenceNumber'];
}
