import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class TemplateDTO {
  @ApiProperty({
    type: String,
    description: 'Template Name, <strong>this name is unique</strong>.',
    required: true,
    example: 'template-name',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  name: string;

  @ApiProperty({
    type: String,
    description: 'Value that will be placed in the message subject.',
    required: true,
    example: 'Example subject',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  title: string;

  @ApiProperty({
    type: String,
    description: 'Template to be saved',
    required: true,
    example:
      '<p> Lorem Ipsum - <strong>{0}</strong> ' +
      'is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard <strong>{1}</strong> ' +
      'ever since the 1500s, when an unknown <strong>{2}</strong> took a galley of type and scrambled it to make a type specimen <strong>{3}</strong>. </p>',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  template: string;
}
