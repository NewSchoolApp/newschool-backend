import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class EmailDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @Expose()
  name: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @Expose()
  email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @Expose()
  title: string;

  @ApiProperty({ type: String })
  @Expose()
  message: string;
}
