import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as Rollbar from 'rollbar';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const error = exception.getResponse();

    let env = this.configService.get<string>('NODE_ENV');

    if (env === 'TEST' || env === 'PROD') {
      const rollbar = new Rollbar({
        accessToken: this.configService.get<string>('ROLLBAR_TOKEN'),
        captureUncaught: true,
        captureUnhandledRejections: true,
      });

      rollbar.warning(JSON.stringify(error));
    }

    response.status(status).json(error);
  }
}
