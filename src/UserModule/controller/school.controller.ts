import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { NeedRole } from 'src/CommonsModule/guard/role-metadata.guard';
import { RoleEnum } from 'src/SecurityModule/enum/role.enum';
import { RoleGuard } from 'src/CommonsModule/guard/role.guard';

@Controller('school')
export class SchoolController {
  constructor(private service: UserService) {}

  @Get()
  // @NeedRole(RoleEnum.ADMIN, RoleEnum.EXTERNAL)
  // @UseGuards(RoleGuard)
  public async getSchool(@Query('name') name: string) {
    return await this.service.getUserSchool(name);
  }
}
