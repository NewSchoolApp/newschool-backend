import { Lesson, Part } from '../entity';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class PartDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  id: Part['id'];

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

  @Type(() => Lesson)
  @Expose()
  lesson: Part['lesson'];

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Expose()
  sequenceNumber: Part['sequenceNumber'];
}
