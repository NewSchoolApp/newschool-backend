import { SchoolService } from '../service/school.service';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { NeedRole } from '../../CommonsModule/guard/role-metadata.guard';
import { RoleEnum } from '../../SecurityModule/enum/role.enum';
import { RoleGuard } from '../../CommonsModule/guard/role.guard';
import { Constants } from '../../CommonsModule/constants';
import { Schools } from '../dto/school.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('School')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.SCHOOL_ENDPOINT}`,
)
export class SchoolController {
  constructor(private service: SchoolService) {}

  @Get()
  @NeedRole(RoleEnum.ADMIN, RoleEnum.EXTERNAL)
  @UseGuards(RoleGuard)
  public async getSchool(@Query('name') name: string): Promise<Schools> {
    return await this.service.getUserSchool(name);
  }
}
