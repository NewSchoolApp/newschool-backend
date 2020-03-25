import { Controller, Get, Query } from '@nestjs/common';
import { Constants } from '../../CommonsModule';
import { DashboardService } from '../service';
import { UserStatusEnum } from '../enum';

@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.DASHBOARD_ENDPOINT}`,
)
export class DashboardController {
  constructor(private service: DashboardService) {}

  @Get('/user/quantity')
  public async getUserQuantity(
    @Query('status') status?: UserStatusEnum,
  ): Promise<number> {
    return null;
  }
}
