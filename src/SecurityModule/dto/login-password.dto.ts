export class LoginPasswordDTO {
  grant_type: 'password' | 'client_credentials' | 'refresh_token';
  username?: string;
  password?: string;
  refresh_token?: string;
}
