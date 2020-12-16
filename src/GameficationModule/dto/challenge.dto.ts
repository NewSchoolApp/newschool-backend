import { IsNotEmpty, IsString } from "class-validator";

export class ChallengeDTO {
  @IsString()
  @IsNotEmpty()
  challenge: string;
}
