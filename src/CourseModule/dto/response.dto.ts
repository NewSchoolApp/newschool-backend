import { Type } from 'class-transformer';
import { UserDTO } from '../../UserModule/dto/user.dto';

class ClappedBy {
  @Type(() => UserDTO)
  user: UserDTO;

  claps: number;
}

class CommentInsideResponseDTO {
  id: string;

  text: string;

  user: UserDTO;

  @Type(() => ResponseDTO)
  responses: Omit<ResponseDTO, 'parentComment' | 'part'>[];

  clappedByTotalCount: number;

  clappedBy: ClappedBy[];
}

export class ResponseDTO {
  id: string;

  text: string;

  partId: number;

  @Type(() => CommentInsideResponseDTO)
  parentComment: CommentInsideResponseDTO;

  @Type(() => UserDTO)
  user: UserDTO;

  clappedByTotalCount: number;

  clappedBy: ClappedBy[];
}
