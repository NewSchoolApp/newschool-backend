import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundError extends HttpException {

  constructor() {
    super('Not found', HttpStatus.NOT_FOUND);
  }
}
