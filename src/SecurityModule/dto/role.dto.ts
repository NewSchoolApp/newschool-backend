import { RoleEnum } from '../enum';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RoleDTO {
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  @ApiProperty({ enum: RoleEnum })
  @Expose()
  name: RoleEnum;
}
