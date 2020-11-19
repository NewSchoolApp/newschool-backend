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
    let dto: CommentDTO = super.toDto(entityObject);
    dto.likes = entityObject.likedBy.length;
    dto = {
      ...dto,
      likes: entityObject.likedBy.length,
    };
    return dto;
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
