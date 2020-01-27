import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as Rollbar from 'rollbar';
import { AppConfigService } from '../../AppConfigModule/service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly configService: ConfigService,
    private readonly appConfigService: AppConfigService,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const error = exception.getResponse();

    const env = this.configService.get<string>('NODE_ENV');

    if (env === 'TEST' || env === 'PROD') {
      const rollbar = new Rollbar(
        this.appConfigService.getRollbarConfiguration(),
      );

      rollbar.warning(JSON.stringify(error));
    }

    response.status(status).json(error);
  }
}
