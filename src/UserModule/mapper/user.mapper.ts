import { Injectable } from '@nestjs/common';
import { UserDTO } from '../dto/user.dto';
import { User } from '../entity/user.entity';
import { Mapper } from '../../CommonsModule/mapper/mapper';
import { UploadService } from '../../UploadModule/service/upload.service';

@Injectable()
export class UserMapper extends Mapper<User, UserDTO> {
  constructor(private readonly uploadService: UploadService) {
    super(User, UserDTO);
  }

  async toDtoAsync(entityObject: User): Promise<UserDTO> {
    const user = super.toDto(entityObject);
    return {
      ...user,
      photo: entityObject.photoPath
        ? await this.uploadService.getUserPhoto(entityObject.photoPath)
        : null,
    };
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
