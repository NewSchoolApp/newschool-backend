import { Injectable } from '@nestjs/common';
import { Mapper } from '../../CommonsModule/mapper/mapper';
import { Comment } from '../entity/comment.entity';
import { CommentDTO } from '../dto/comment.dto';

@Injectable()
export class CommentMapper extends Mapper<Comment, CommentDTO> {
  constructor() {
    super(Comment, CommentDTO);
  }

  toDto(entityObject: Partial<Comment>): CommentDTO {
    return super.toDto(entityObject);
  }

  toDtoList(entityArray: Comment[]): CommentDTO[] {
    return super.toDtoList(entityArray);
  }

  toEntity(dtoObject: Partial<CommentDTO>): Comment {
    return super.toEntity(dtoObject);
  }

  toEntityList(dtoArray: CommentDTO[]): Comment[] {
    return super.toEntityList(dtoArray);
  }
}
