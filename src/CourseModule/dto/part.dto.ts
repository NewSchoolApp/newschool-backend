import { Part } from '../entity';
import { ApiModelProperty } from '@nestjs/swagger';

export class PartDTO {
    @ApiModelProperty({ type: String })
    id: Part['id'];

    @ApiModelProperty({ type: String })
    title: string;

    @ApiModelProperty({ type: String })
    description: string;

    @ApiModelProperty({ type: String })
    vimeoUrl: string;

    @ApiModelProperty({ type: String })
    youtubeUrl: string;

    @ApiModelProperty({ type: String })
    lessonId: string;

    @ApiModelProperty({ type: String })
    nextPartId: string;
}
