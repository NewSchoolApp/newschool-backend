import { Injectable } from '@nestjs/common';
import { Mapper } from '../../CommonsModule/mapper';
import { PartDTO } from '../dto/part.dto';
import { Part } from '../entity';

@Injectable()
export class PartMapper extends Mapper<Part, PartDTO> {
  constructor() {
    super(Part, PartDTO);
  }

  toDto(entityObject: Part): PartDTO {
    return super.toDto(entityObject);
  }

  toDtoList(entityArray: Part[]): PartDTO[] {
    return super.toDtoList(entityArray);
  }

  toEntity(dtoObject: PartDTO): Part {
    return super.toEntity(dtoObject);
  }

  toEntityList(dtoArray: PartDTO[]): Part[] {
    return super.toEntityList(dtoArray);
  }
}
