import { ApiModelProperty } from '@nestjs/swagger';

export class SendMessageSwagger {
    @ApiModelProperty({
        required: true,
        description: 'Free to upload any data needed for emailing',
    })
    data: any;

    @ApiModelProperty({
        type: String,
        required: true,
        description: 'Email that will be sent the message',
        example: 'email@email.com',
    })
    contactEmail: string;

    @ApiModelProperty({
        type: String,
        required: true,
        description: 'Name of template to use.',
        example: 'example-template',
    })
    templateName: string;
}
