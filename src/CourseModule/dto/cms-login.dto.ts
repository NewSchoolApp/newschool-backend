export class CMSLoginDTO {
  jwt: string;
  user: CmsUserDTO;
}

export class CmsUserDTO {
  id: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  role: CmsRoleDTO;
  'created_at': Date;
  'updated_at': Date;
}

export class CmsRoleDTO {
  id: number;
  name: string;
  description: string;
  type: string;
}
