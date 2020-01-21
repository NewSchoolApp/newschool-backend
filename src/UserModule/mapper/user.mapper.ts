import { Injectable } from '@nestjs/common';
import { Mapper } from '../../CommonsModule/mapper';
import { UserDTO } from '../dto';
import { User } from '../entity';

@Injectable()
export class UserMapper extends Mapper<User, UserDTO> {
  constructor() {
    super(User, UserDTO);
  }

  toDto(entityObject: User): UserDTO {
    return super.toDto(entityObject);
  }

  toDtoList(entityArray: User[]): UserDTO[] {
    return super.toDtoList(entityArray);
  }

  toEntity(dtoObject: UserDTO): User {
    return super.toEntity(dtoObject);
  }

  toEntityList(dtoArray: UserDTO[]): User[] {
    return super.toEntityList(dtoArray);
  }
}
