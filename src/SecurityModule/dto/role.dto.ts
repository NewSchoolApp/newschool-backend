import { Expose, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { PolicyDTO } from './policy.dto';

export class RoleDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  id: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  name: string;

  @Type(() => PolicyDTO)
  @IsArray()
  @IsNotEmpty()
  @Expose()
  policies: PolicyDTO[];
}
