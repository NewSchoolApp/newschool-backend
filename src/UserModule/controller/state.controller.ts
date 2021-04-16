import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL, Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { Constants } from '../../CommonsModule/constants';
import { NeedPolicies, NeedRoles } from '../../CommonsModule/decorator/role-guard-metadata.decorator';
import { RoleEnum } from '../../SecurityModule/enum/role.enum';
import { RoleGuard } from '../../CommonsModule/guard/role.guard';
import { StateService } from '../service/state.service';
import { StateDTO } from '../dto/state.dto';

const secondsInADay = 86400;

@ApiTags('State')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.STATE_ENDPOINT}`,
)
export class StateController {
  constructor(private service: StateService) {}

  @Get()
  @NeedRoles(RoleEnum.ADMIN, RoleEnum.STUDENT, RoleEnum.EXTERNAL)
  @NeedPolicies(`${Constants.POLICIES_PREFIX}/GET_STATES`)
  @UseGuards(RoleGuard)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(secondsInADay)
  public async getStates(): Promise<StateDTO[]> {
    return await this.service.getStates();
  }
}
