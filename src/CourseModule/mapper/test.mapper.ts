import { Injectable } from '@nestjs/common';
import { Mapper } from '../../CommonsModule/mapper';
import { TestDTO } from '../dto/test.dto';
import { Test } from '../entity';

@Injectable()
export class TestMapper extends Mapper<Test, TestDTO> {

  constructor() {
    super(Test, TestDTO);
  }

  toDto(entityObject: Test): TestDTO {
    return super.toDto(entityObject);
  }

  toDtoList(entityArray: Test[]): TestDTO[] {
    return super.toDtoList(entityArray);
  }

  toEntity(dtoObject: TestDTO): Test {
    return super.toEntity(dtoObject);
  }

  toEntityList(dtoArray: TestDTO[]): Test[] {
    return super.toEntityList(dtoArray);
  }
}
