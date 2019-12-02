import { Injectable } from '@nestjs/common';

@Injectable()
export class SecurityService {

  findAll(): string[] {
    return ['1', '2', '3'];
  }
}
