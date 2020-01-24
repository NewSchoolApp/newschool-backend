import { ApiProperty } from '@nestjs/swagger';
import { Course } from '../entity';
import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { User } from '../../UserModule';

export class CourseUpdateDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @Expose()
  title: Course['title'];

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @Expose()
  thumbUrl: Course['thumbUrl'];

  @ApiProperty({ type: String })
  @Expose()
  description: Course['description'];

  @ApiProperty({ type: String })
  @Expose()
  workload: Course['workload'];

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @Expose()
  authorId: User['id'];
}
