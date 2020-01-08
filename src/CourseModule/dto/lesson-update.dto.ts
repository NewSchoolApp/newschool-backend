import { ApiModelProperty } from '@nestjs/swagger';
import { Lesson } from '../entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class LessonUpdateDTO {
    @IsString()
    @Expose()
    @IsNotEmpty()
    @ApiModelProperty({ type: String })
    title: Lesson['title'];

    @IsString()
    @Expose()
    @IsNotEmpty()
    @ApiModelProperty({ type: String })
    description: Lesson['description'];

    @IsString()
    @Expose()
    @IsNotEmpty()
    @ApiModelProperty({ type: String })
    course: Lesson['course'];

    @IsString()
    @Expose()
    @IsNotEmpty()
    @ApiModelProperty({ type: String })
    nextLesson: Lesson['nextLesson'];
}
