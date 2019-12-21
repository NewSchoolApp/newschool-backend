import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Bem vindo ao backend da NewSchool!';
  }
}
