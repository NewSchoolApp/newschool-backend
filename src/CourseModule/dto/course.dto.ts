import { Course } from '../entity';
import { ApiModelProperty } from '@nestjs/swagger';

export class CourseDTO {
  @ApiModelProperty({ type: Number })
  id: Course['id'];

  @ApiModelProperty({ type: String })
  name: Course['name'];


}
