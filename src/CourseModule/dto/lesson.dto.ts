import { Lesson } from '../entity';
import { ApiModelProperty } from '@nestjs/swagger';

export class LessonDTO {
    @ApiModelProperty({ type: String })
    id: Lesson['id'];

    @ApiModelProperty({ type: String })
    title: Lesson['title'];

    @ApiModelProperty({ type: String })
    description: Lesson['description'];

    @ApiModelProperty({ type: String })
    course: Lesson['course'];

    @ApiModelProperty({ type: String })
    nextLesson: Lesson['nextLesson'];
}
