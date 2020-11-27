import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class ClapCommentDTO {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(50)
  claps: number;
}
