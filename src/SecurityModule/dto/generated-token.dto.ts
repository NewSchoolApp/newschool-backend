import { ApiProperty } from '@nestjs/swagger';

export class GeneratedTokenDTO {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  refreshToken: string;
  @ApiProperty()
  tokenType: string;
  @ApiProperty()
  expiresIn: string;
}
