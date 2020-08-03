import { User } from '../../UserModule/entity/user.entity';

export class RefreshTokenUserDTO extends User {
  isRefreshToken: boolean;
}
