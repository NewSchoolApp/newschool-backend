import { PartDTO } from './part.dto';
import { Type } from 'class-transformer';
import { UserDTO } from '../../UserModule/dto/user.dto';

class ResponseInsideCommentDTO {
  id: string;

  text: string;

  likedBy: UserDTO[];
}

export class CommentDTO {
  id: string;

  text: string;

  user: UserDTO;

  @Type(() => PartDTO)
  part: PartDTO;

  @Type(() => ResponseInsideCommentDTO)
  responses: ResponseInsideCommentDTO[];

  likedBy: UserDTO[];
}
