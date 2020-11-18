import { Type } from 'class-transformer';
import { PartDTO } from './part.dto';
import { CommentDTO } from './comment.dto';

export class ResponseDTO {
  id: string;

  text: string;

  @Type(() => PartDTO)
  part: PartDTO;

  @Type(() => CommentDTO)
  parentComment: CommentDTO;

  likes: number;
}
