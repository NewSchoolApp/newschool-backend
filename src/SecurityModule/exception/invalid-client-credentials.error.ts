import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidClientCredentialsError extends HttpException {

  constructor() {
    super('Not found', HttpStatus.NOT_FOUND);
  }
}
