import { User } from '../entity/user.entity';
import { UserProfileEnum } from '../enum/user-profile.enum';
import { GenderEnum } from '../enum/gender.enum';
import { EscolarityEnum } from '../enum/escolarity.enum';
import { RoleEnum } from '../../SecurityModule/enum/role.enum';

export class NewUserSwagger {
  name: string;

  email: string;

  profile: UserProfileEnum;

  password: string;

  nickname?: string;

  birthday?: Date;

  gender?: GenderEnum;

  schooling?: EscolarityEnum;

  institutionName?: string;

  profession?: string;

  address?: string;

  urlFacebook?: User['urlFacebook'];

  urlInstagram?: User['urlInstagram'];

  role: RoleEnum;
}
