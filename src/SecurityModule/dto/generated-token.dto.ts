import { IsNotEmpty, IsString } from 'class-validator';

export class GeneratedTokenDTO {
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @IsNotEmpty()
  @IsString()
  refreshToken: string;

  @IsNotEmpty()
  @IsString()
  tokenType: string;

  @IsNotEmpty()
  @IsString()
  expiresIn: string;
}
