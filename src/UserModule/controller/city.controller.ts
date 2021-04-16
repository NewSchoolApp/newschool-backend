import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL, Controller, Get, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { Constants } from '../../CommonsModule/constants';
import { CityService } from '../service/city.service';
import { CityDTO } from '../dto/city.dto';
import { NeedPolicies, NeedRoles } from '../../CommonsModule/decorator/role-guard-metadata.decorator';
import { RoleEnum } from '../../SecurityModule/enum/role.enum';
import { RoleGuard } from '../../CommonsModule/guard/role.guard';

const secondsInADay = 86400;

@ApiTags('City')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.CITY_ENDPOINT}`,
)
export class CityController {
  constructor(private service: CityService) {}

  @Get('/:uf')
  @UseGuards(RoleGuard)
  @NeedRoles(RoleEnum.ADMIN, RoleEnum.STUDENT, RoleEnum.EXTERNAL)
  @NeedPolicies(`${Constants.POLICIES_PREFIX}/GET_CITIES_BY_UF`)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(secondsInADay)
  public async getCitiesByUf(@Param('uf') uf: string): Promise<CityDTO[]> {
    return await this.service.getCitiesByUf(uf);
  }
}
