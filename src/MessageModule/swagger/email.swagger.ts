import { ApiProperty } from '@nestjs/swagger';

export class EmailSwagger {
  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  message: string;
}
