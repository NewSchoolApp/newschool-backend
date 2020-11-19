import { PartDTO } from './part.dto';
import { Type } from 'class-transformer';
import { ResponseDTO } from './response.dto';
import { UserDTO } from '../../UserModule/dto/user.dto';

export class CommentDTO {
  id: string;

  text: string;

  @Type(() => PartDTO)
  part: PartDTO;

  @Type(() => ResponseDTO)
  responses: ResponseDTO[];

  user: UserDTO;

  likes: number;
}
