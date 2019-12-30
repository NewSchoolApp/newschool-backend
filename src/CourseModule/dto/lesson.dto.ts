import { Lesson } from '../entity';
import { ApiModelProperty } from '@nestjs/swagger';

export class LessonDTO {
    @ApiModelProperty({ type: String })
    id: Lesson['id'];

    @ApiModelProperty({ type: String })
    title: string;

    @ApiModelProperty({ type: String })
    description: string;

    @ApiModelProperty({ type: String })
    courseId: string;

    @ApiModelProperty({ type: String })
    nextLessonId: string;
}
