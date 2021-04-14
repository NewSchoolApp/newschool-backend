import { SchoolService } from '../service/school.service';
import { CacheInterceptor, CacheTTL, Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { NeedPolicies, NeedRoles } from '../../CommonsModule/decorator/role-guard-metadata.decorator';
import { RoleEnum } from '../../SecurityModule/enum/role.enum';
import { RoleGuard } from '../../CommonsModule/guard/role.guard';
import { Constants } from '../../CommonsModule/constants';
import { School } from '../dto/school.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

const secondsInADay = 86400;

@ApiTags('School')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.SCHOOL_ENDPOINT}`,
)
export class SchoolController {
  constructor(private service: SchoolService) {}

  @Get()
  @UseGuards(RoleGuard)
  @NeedRoles(RoleEnum.ADMIN, RoleEnum.STUDENT, RoleEnum.EXTERNAL)
  @NeedPolicies(`${Constants.POLICIES_PREFIX}/GET_CITIES_BY_UF`)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(secondsInADay)
  public async getSchool(@Query('name') name = ''): Promise<School[]> {
    return await this.service.getUserSchool(name);
  }
}
