import {
  Body,
  Controller,
  Headers,
  HttpCode,
  LoggerService,
  Post,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { SecurityService } from '../service';
import { Constants } from '../../CommonsModule';
import { AuthDTO, GeneratedTokenDTO } from '../dto';
import { GrantTypeEnum } from '../enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ClientCredentials } from '../entity';
import { User } from '../../UserModule/entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller(`/${Constants.OAUTH_ENDPOINT}`)
export class SecurityController {
  constructor(
    private readonly service: SecurityService,
    private readonly logger: LoggerService,
  ) {
  }

  @UseInterceptors(FileInterceptor(''))
  @Post('/token')
  @HttpCode(200)
  async authenticateUser(
    // eslint-disable-next-line @typescript-eslint/camelcase
    @Body() { grant_type, username, password, refresh_token }: AuthDTO,
    @Headers('authorization') authorization: string,
  ): Promise<GeneratedTokenDTO> {
    if (!authorization)
      throw new UnauthorizedException();

    // eslint-disable-next-line @typescript-eslint/camelcase
    this.logger.log(`grant_type: ${grant_type}`);

    // Basic <base64login>
    const [, base64Login]: string[] = authorization.split(' ');
    // eslint-disable-next-line @typescript-eslint/camelcase
    if (grant_type === GrantTypeEnum.CLIENT_CREDENTIALS) {
      return this.service.validateClientCredentials(base64Login);
    }
    // eslint-disable-next-line @typescript-eslint/camelcase
    if (grant_type === GrantTypeEnum.PASSWORD) {
      this.logger.log(`username: ${username}, password: ${password}`);
      return this.service.validateUserCredentials(
        base64Login,
        username,
        password,
      );
    }
    // eslint-disable-next-line @typescript-eslint/camelcase
    if (grant_type === GrantTypeEnum.REFRESH_TOKEN) {
      return this.service.refreshToken(
        base64Login,
        refresh_token,
      );
    }
  }

  @Post('/token/details')
  @ApiBearerAuth()
  getTokenDetails(@Headers('authorization') authorizationHeader: string): ClientCredentials | User {
    const [, jwt] = authorizationHeader.split(' ');
    this.logger.log(`jwt: ${jwt}`);
    return this.service.decodeToken(jwt);
  }
}
