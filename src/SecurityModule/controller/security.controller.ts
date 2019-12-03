import { Controller, Get } from '@nestjs/common';
import { SecurityService } from '../service';
import { Constants } from '../../CommonsModule';

@Controller(`/${Constants.OAUTH_ENDPOINT}`)
export class SecurityController {
  constructor(private readonly service: SecurityService) {
  }

  @Get()
  findAll(): string[] {
    return this.service.findAll();
  }
}
