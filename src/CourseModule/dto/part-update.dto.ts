import { Part } from '../entity';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class PartUpdateDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  title: Part['title'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  description: Part['description'];

  @IsOptional()
  @IsString()
  @Expose()
  vimeoUrl?: Part['vimeoUrl'];

  @IsOptional()
  @IsString()
  @Expose()
  youtubeUrl?: Part['youtubeUrl'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  lessonId: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Expose()
  sequenceNumber: Part['sequenceNumber'];
}
