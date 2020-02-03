import { RoleEnum } from '../enum';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class RoleDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  id: string;

  @IsNotEmpty()
  @IsEnum(RoleEnum)
  @Expose()
  name: RoleEnum;
}
