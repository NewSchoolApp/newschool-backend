import { ApiModelProperty } from '@nestjs/swagger';
import { Part } from '../entity';
import { IsNotEmpty } from 'class-validator';

export class NewPartDTO {
    @ApiModelProperty({ type: String })
    title: Part['title'];

    @ApiModelProperty({ type: String })
    description: Part['description'];

    @ApiModelProperty({ type: String })
    vimeoUrl: Part['vimeoUrl'];

    @ApiModelProperty({ type: String })
    youtubeUrl: Part['youtubeUrl'];

    @ApiModelProperty({ type: String })
    lessonId: Part['lessonId'];

    @ApiModelProperty({ type: String })
    nextPartId: Part['nextPartId'];
}
