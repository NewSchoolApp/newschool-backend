import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

export class RoleDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  id: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  name: string;
}
