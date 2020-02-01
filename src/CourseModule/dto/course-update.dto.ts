import { ApiProperty } from '@nestjs/swagger';
import { Course } from '../entity';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class CourseUpdateDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Expose()
  title: Course['title'];

  @ApiProperty({ type: String })
  @IsString()
  @Expose()
  thumbUrl: Course['thumbUrl'];

  @ApiProperty({ type: String })
  @IsString()
  @Expose()
  description: Course['description'];

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Expose()
  workload: Course['workload'];

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Expose()
  authorName: Course['authorName'];

  @ApiProperty({ type: String })
  @IsString()
  @Expose()
  authorDescription: Course['authorDescription'];
}
