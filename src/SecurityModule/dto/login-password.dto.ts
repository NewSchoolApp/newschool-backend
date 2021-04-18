export class LoginPasswordDTO {
  grant_type: 'password' | 'client_credentials';
  username?: string;
  password?: string;
}
