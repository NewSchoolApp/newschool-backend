import { Injectable } from '@nestjs/common';
import { PartDTO } from '../dto/part.dto';
import { Part } from '../entity/part.entity';
import { Mapper } from '../../CommonsModule/mapper/mapper';

@Injectable()
export class PartMapper extends Mapper<Part, PartDTO> {
  constructor() {
    super(Part, PartDTO);
  }

  toDto(entityObject: Partial<Part>): PartDTO {
    return super.toDto(entityObject);
  }

  toDtoList(entityArray: Part[]): PartDTO[] {
    return super.toDtoList(entityArray);
  }

  toEntity(dtoObject: Partial<PartDTO>): Part {
    return super.toEntity(dtoObject);
  }

  toEntityList(dtoArray: PartDTO[]): Part[] {
    return super.toEntityList(dtoArray);
  }
}
