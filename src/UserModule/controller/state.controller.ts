import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CacheInterceptor,
  CacheTTL,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Constants } from '../../CommonsModule/constants';
import { NeedRole } from '../../CommonsModule/guard/role-metadata.guard';
import { RoleEnum } from '../../SecurityModule/enum/role.enum';
import { RoleGuard } from '../../CommonsModule/guard/role.guard';
import { StateService } from '../service/state.service';
import { StateDTO } from '../dto/state.dto';

const secondsInADay = 86400;

@ApiTags('City')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.CITY_ENDPOINT}`,
)
export class StateController {
  constructor(private service: StateService) {}

  @Get()
  @NeedRole(RoleEnum.ADMIN, RoleEnum.EXTERNAL)
  @UseGuards(RoleGuard)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(secondsInADay)
  public async getCitiesByUf(): Promise<StateDTO[]> {
    return await this.service.getStates();
  }
}
