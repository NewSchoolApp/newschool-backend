import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidClientCredentialsError extends HttpException {
  constructor() {
    super('Client credentials not found', HttpStatus.NOT_FOUND);
  }
}
