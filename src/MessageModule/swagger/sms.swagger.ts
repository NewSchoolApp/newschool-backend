import { ApiProperty } from '@nestjs/swagger';

export class SMSSwagger {
  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  phone: string;

  @ApiProperty({ type: String })
  message: string;

  @ApiProperty({ type: String })
  title: string;
}
