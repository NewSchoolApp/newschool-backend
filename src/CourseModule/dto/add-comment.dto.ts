import { IsNotEmpty, IsString } from 'class-validator';

export class AddCommentDTO {
  @IsNotEmpty()
  @IsString()
  partId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  text: string;
}
