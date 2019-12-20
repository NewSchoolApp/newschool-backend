import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import * as Rollbar from 'rollbar'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        const rollbar = new Rollbar({
            accessToken: process.env.ROLLBAR_TOKEN,
            captureUncaught: true,
            captureUnhandledRejections: true
          });
                
        const objResponse = exception.getResponse();
        
        console.error(objResponse);

        rollbar.warning(JSON.stringify(objResponse));

        response.status(status).json(objResponse);
    }
}