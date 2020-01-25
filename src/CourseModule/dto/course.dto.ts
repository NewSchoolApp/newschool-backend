import { Course } from '../entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CourseDTO {
  @ApiProperty({ type: String })
  @Expose()
  id: Course['id'];

  @ApiProperty({ type: String })
  @Expose()
  title: Course['title'];

  @ApiProperty({ type: String })
  @Expose()
  description: Course['description'];

  @ApiProperty({ type: String })
  @Expose()
  workload: Course['workload'];

  @ApiProperty({ type: String })
  @Expose()
  thumbUrl: Course['thumbUrl'];

  @ApiProperty({ type: String })
  @Expose()
  enabled: Course['enabled'];

  @ApiProperty({ type: String })
  @Expose()
  authorName: string;

  @ApiProperty({ type: String })
  @Expose()
  authorDescription: string;

  @ApiProperty({ type: Number })
  @Expose()
  slug: string;
}
