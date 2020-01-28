import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import * as Rollbar from 'rollbar';
import { ConfigService } from '../../ConfigModule/service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const error = exception.getResponse();

    const env = this.configService.nodeEnv;

    if (env === 'TEST' || env === 'PROD') {
      const rollbar = new Rollbar(this.configService.getRollbarConfiguration());

      rollbar.warning(JSON.stringify(error));
    }

    response.status(status).json(error);
  }
}
