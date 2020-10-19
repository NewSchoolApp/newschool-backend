import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class GeneratedTokenDTO {
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken?: string;

  @IsNotEmpty()
  @IsString()
  tokenType: string;

  @IsNotEmpty()
  @IsNumber()
  expiresIn: number;
}
