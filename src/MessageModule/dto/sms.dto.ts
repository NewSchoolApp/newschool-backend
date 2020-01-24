import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class SMSDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @Expose()
  name: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @Expose()
  phone: string;

  @ApiProperty({ type: String })
  @Expose()
  message: string;
}
