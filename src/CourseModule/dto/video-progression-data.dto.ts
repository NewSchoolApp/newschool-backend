import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class VideoProgressionDataDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  videoUrl: string;

  @IsOptional()
  @IsString()
  @Expose()
  lessonTitle?: string;
}
