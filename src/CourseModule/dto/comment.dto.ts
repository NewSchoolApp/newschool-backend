import { Type } from 'class-transformer';
import { UserDTO } from '../../UserModule/dto/user.dto';

class ClappedBy {
  @Type(() => UserDTO)
  user: UserDTO;

  claps: number;
}

class ResponseInsideCommentDTO {
  id: string;

  text: string;

  clappedByTotalCount: number;

  clappedBy: ClappedBy[];
}

export class CommentDTO {
  id: string;

  text: string;

  user: UserDTO;

  partId: number;

  @Type(() => ResponseInsideCommentDTO)
  responses: ResponseInsideCommentDTO[];

  clappedByTotalCount: number;

  clappedBy: ClappedBy[];
}
