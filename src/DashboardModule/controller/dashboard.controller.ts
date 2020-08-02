import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Constants } from '../../CommonsModule/constants';
import { NeedRole } from '../../CommonsModule/guard/role-metadata.guard';
import { RoleGuard } from '../../CommonsModule/guard/role.guard';
import { DashboardService } from '../service/dashboard.service';
import { UserStatusEnum } from '../enum/UserStatusEnum';
import { RoleEnum } from '../../SecurityModule/enum/role.enum';
import { UserQuantityDTO } from '../dto/user-quantity.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Dashboard')
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.DASHBOARD_ENDPOINT}`,
)
export class DashboardController {
  constructor(private service: DashboardService) {}

  @Get('/user/quantity')
  @UseGuards(RoleGuard)
  @NeedRole(RoleEnum.ADMIN)
  public async getUserQuantity(
    @Query('status') status?: UserStatusEnum,
  ): Promise<UserQuantityDTO> {
    return { totalElements: await this.service.getUserQuantity(status) };
  }
}
