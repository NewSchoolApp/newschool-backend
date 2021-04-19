import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UserJWTDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  id: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  username: string;

  @IsNotEmpty()
  @IsBoolean()
  @Expose()
  enabled: boolean;

  @Expose()
  @IsNotEmpty()
  role: RoleJWTDTO;

  @IsString()
  @Expose()
  phone?: string;

  @IsString()
  @Expose()
  email?: string;
}

export class RoleJWTDTO {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Type(() => PolicyJWTDTO)
  @IsNotEmpty()
  @Expose()
  policies: PolicyJWTDTO[];
}

export class PolicyJWTDTO {
  @Expose()
  id: string;
  @Expose()
  name: string;
}
