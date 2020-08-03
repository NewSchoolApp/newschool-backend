import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Logger,
  Post,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { SecurityService } from '../service/security.service';
import { Constants } from '../../CommonsModule';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '../../UserModule/entity/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { FacebookAuthUserDTO } from '../dto/facebook-auth-user.dto';
import { AuthDTO } from '../dto/auth.dto';
import { GrantTypeEnum } from '../enum/grant-type.enum';
import { GeneratedTokenDTO } from '../dto/generated-token.dto';
import { GoogleAuthUserDTO } from '../dto/google-auth-user.dto';
import { ClientCredentials } from '../entity/client-credentials.entity';

@Controller(`/${Constants.OAUTH_ENDPOINT}`)
@ApiTags('Security')
export class SecurityController {
  private readonly logger = new Logger(SecurityController.name);

  constructor(private readonly service: SecurityService) {}

  @UseInterceptors(FileInterceptor(''))
  @Post('/token')
  @HttpCode(200)
  async authenticateUser(
    // eslint-disable-next-line @typescript-eslint/camelcase,camelcase
    @Body() { grant_type, username, password, refresh_token }: AuthDTO,
    @Headers('authorization') authorization: string,
  ): Promise<GeneratedTokenDTO> {
    if (!authorization) {
      throw new UnauthorizedException();
    }

    // eslint-disable-next-line @typescript-eslint/camelcase,camelcase
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
      return this.service.refreshToken(base64Login, refresh_token);
    }
  }

  @UseInterceptors(FileInterceptor(''))
  @Post('/facebook/token')
  @HttpCode(200)
  async authenticateFacebookUser(
    @Body() facebookAuthUser: FacebookAuthUserDTO,
  ): Promise<GeneratedTokenDTO> {
    return this.service.validateFacebookUser(facebookAuthUser);
  }

  @UseInterceptors(FileInterceptor(''))
  @Post('/google/token')
  @HttpCode(200)
  async authenticateGoogleUser(
    @Body() googleAuthUser: GoogleAuthUserDTO,
  ): Promise<GeneratedTokenDTO> {
    return this.service.validateGoogleUser(googleAuthUser);
  }

  @Post('/token/details')
  @ApiBearerAuth()
  getTokenDetails(
    @Headers('authorization') authorizationHeader: string,
  ): ClientCredentials | User {
    const [, jwt] = authorizationHeader.split(' ');
    this.logger.log(`jwt: ${jwt}`);
    return this.service.decodeToken(jwt);
  }
}
