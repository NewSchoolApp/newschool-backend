import { HttpException, HttpStatus } from '@nestjs/common';

export class CourseNotFoundError extends HttpException {

  constructor() {
    super('Not found', HttpStatus.NOT_FOUND);
  }
}
