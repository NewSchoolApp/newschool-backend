import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordRequestIdDTO {
  @ApiProperty()
  id: string;
}
