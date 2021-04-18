import { HttpService, Injectable } from '@nestjs/common';
import { AppConfigService as ConfigService } from '../../ConfigModule/service/app-config.service';
import { GeneratedTokenDTO } from '../dto/generated-token.dto';
import { NewUserDTO } from '../dto/new-user.dto';
import { AxiosResponse } from 'axios';
import { LoginPasswordDTO } from '../dto/login-password.dto';

@Injectable()
export class SecurityIntegration {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  public async getAccessToken(): Promise<string> {
    const clientCredentialsBase64 = this.config.getClientCredentialsBase64();
    const headers = {
      Authorization: `Basic ${clientCredentialsBase64}`,
    };
    const body = {
      grant_type: 'client_credentials',
    };
    const {
      data: { accessToken },
    } = await this.http
      .post<GeneratedTokenDTO>(this.config.securityOauthTokenUrl, body, {
        headers,
      })
      .toPromise();
    return accessToken;
  }

  public async userLogin({
    base64Login,
    ...params
  }: {
    username: string;
    password: string;
    base64Login: string;
  }): Promise<AxiosResponse<GeneratedTokenDTO>> {
    const headers = {
      authorization: `Basic ${base64Login}`,
    };
    const body: LoginPasswordDTO = {
      grant_type: 'password',
      ...params,
    };
    return await this.http
      .post<GeneratedTokenDTO>(this.config.securityOauthTokenUrl, body, {
        headers,
      })
      .toPromise();
  }

  public async clientCredentialsLogin({
    base64Login,
  }: {
    base64Login: string;
  }): Promise<AxiosResponse<GeneratedTokenDTO>> {
    const headers = {
      authorization: `Basic ${base64Login}`,
    };
    const body: LoginPasswordDTO = {
      grant_type: 'client_credentials',
    };
    return await this.http
      .post<GeneratedTokenDTO>(this.config.securityOauthTokenUrl, body, {
        headers,
      })
      .toPromise();
  }

  public async addNewStudent(params: {
    username: string;
    password: string;
  }): Promise<AxiosResponse> {
    const accessToken: string = await this.getAccessToken();
    const headers = {
      authorization: `Bearer ${accessToken}`,
    };
    const body: NewUserDTO = {
      ...params,
      roleName: 'STUDENT',
    };
    return await this.http
      .post(this.config.securityOauthTokenUrl, body, {
        headers,
      })
      .toPromise();
  }
}