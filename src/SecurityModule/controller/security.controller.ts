import { Body, Controller, Headers, HttpCode, Post, UseInterceptors, UnauthorizedException, UploadedFiles } from '@nestjs/common';
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
  constructor(private readonly service: SecurityService) {
  }

  @UseInterceptors(FileInterceptor(''))
  @Post('/token')
  @HttpCode(200)
  async authenticateUser(
    // eslint-disable-next-line @typescript-eslint/camelcase
    @Body() { grant_type, username, password }: AuthDTO,
    @UploadedFiles() files,
    @Headers('authorization') authorization: string,
  ): Promise<GeneratedTokenDTO> {
    if (!authorization)
      throw new UnauthorizedException();
      
    // Basic <base64login>
    const [, base64Login]: string[] = authorization.split(' ');
    // eslint-disable-next-line @typescript-eslint/camelcase
    if (grant_type === GrantTypeEnum.CLIENT_CREDENTIALS) {
      return this.service.validateClientCredentials(base64Login);
    }
    // eslint-disable-next-line @typescript-eslint/camelcase
    if (grant_type === GrantTypeEnum.PASSWORD) {
      return this.service.validateUserCredentials(
        base64Login,
        username,
        password,
      );
    }
  }

  @Post('/token/details')
  @ApiBearerAuth()
  getTokenDetails(@Headers('authorization') authorizationHeader: string): ClientCredentials | User {
    const [, jwt] = authorizationHeader.split(' ');
    return this.service.decodeToken(jwt);
  }
}
