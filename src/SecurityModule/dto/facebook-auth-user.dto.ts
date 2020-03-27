import { IsNotEmpty, IsString } from 'class-validator';

export class FacebookAuthUserDTO {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}
