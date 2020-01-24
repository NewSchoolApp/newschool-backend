import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundError extends HttpException {
  constructor() {
    super('User not found', HttpStatus.NOT_FOUND);
  }
}
