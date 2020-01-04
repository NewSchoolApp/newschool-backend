import { ApiModelProperty } from '@nestjs/swagger';

export class EmailMessageSwagger {
    @ApiModelProperty({ type: String })
    name: string;

    @ApiModelProperty({ type: String })
    email: string;

    @ApiModelProperty({ type: String })
    title: string;

    @ApiModelProperty({ type: String })
    message: string;
}
