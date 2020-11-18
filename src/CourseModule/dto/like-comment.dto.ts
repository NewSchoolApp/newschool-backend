import { IsNotEmpty, IsString } from 'class-validator';

export class LikeCommentDTO {
  @IsNotEmpty()
  @IsString()
  userId: string;
}
