import { Injectable } from '@nestjs/common';
import { Templates } from '../entity/templates.entity';
import { TemplateDTO } from '../dto/templates.dto';
import { Mapper } from '../../CommonsModule/mapper/mapper';

@Injectable()
export class TemplateMapper extends Mapper<Templates, TemplateDTO> {
  constructor() {
    super(Templates, TemplateDTO);
  }

  toDto(entityObject: Templates): TemplateDTO {
    return super.toDto(entityObject);
  }

  toDtoList(entityArray: Templates[]): TemplateDTO[] {
    return super.toDtoList(entityArray);
  }

  toEntity(dtoObject: TemplateDTO): Templates {
    return super.toEntity(dtoObject);
  }

  toEntityList(dtoArray: TemplateDTO[]): Templates[] {
    return super.toEntityList(dtoArray);
  }
}
