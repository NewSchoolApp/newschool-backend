import { Type } from 'class-transformer';
import { PartDTO } from './part.dto';
import { UserDTO } from '../../UserModule/dto/user.dto';

class CommentInsideResponseDTO {
  id: string;

  text: string;

  user: UserDTO;

  @Type(() => ResponseDTO)
  responses: Omit<ResponseDTO, 'parentComment' | 'part'>[];

  likedBy: UserDTO[];
}

export class ResponseDTO {
  id: string;

  text: string;

  @Type(() => PartDTO)
  part: PartDTO;

  @Type(() => CommentInsideResponseDTO)
  parentComment: CommentInsideResponseDTO;

  user: UserDTO;

  likedBy: UserDTO[];
}
