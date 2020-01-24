import { User } from '../../UserModule/entity';

export class RefreshTokenUserDTO extends User {
  isRefreshToken: boolean;
}
