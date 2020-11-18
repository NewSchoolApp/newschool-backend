import { PartDTO } from './part.dto';
import { Type } from 'class-transformer';
import { ResponseDTO } from './response.dto';

export class CommentDTO {
  id: string;

  text: string;

  @Type(() => PartDTO)
  part: PartDTO;

  @Type(() => CommentDTO)
  responses: ResponseDTO[];

  likes: number;
}
