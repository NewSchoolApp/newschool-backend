import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleAuthUserDTO {
  @IsNotEmpty()
  @IsString()
  sub: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}
