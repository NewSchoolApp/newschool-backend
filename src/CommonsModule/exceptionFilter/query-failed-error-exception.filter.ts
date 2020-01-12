import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Request, Response } from 'express';

@Catch(QueryFailedError)
export class QueryFailedErrorExceptionFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest<Request>();

    if (exception.code === 'ER_DUP_ENTRY') {
      response
        .status(409)
        .json({
          statusCode: 409,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
    } else {
      response
        .status(500)
        .json({
          statusCode: 500,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
    }
  }
}
