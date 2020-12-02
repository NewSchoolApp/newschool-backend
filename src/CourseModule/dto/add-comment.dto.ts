import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddCommentDTO {
  @IsNotEmpty()
  @IsNumber()
  partId: number;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  text: string;
}
