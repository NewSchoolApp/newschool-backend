import { ApiProperty } from '@nestjs/swagger';

export class SendMessageSwagger {
  @ApiProperty({
    required: true,
    description: 'Free to upload any data needed for emailing',
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Email that will be sent the message',
    example: 'email@email.com',
  })
  contactEmail: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Name of template to use.',
    example: 'example-template',
  })
  templateName: string;
}
