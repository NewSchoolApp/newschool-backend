import { Controller } from '@nestjs/common';
import { Constants } from '../../CommonsModule';
import { DashboardService } from '../service';

@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.DASHBOARD_ENDPOINT}`,
)
export class DashboardController {
  constructor(private service: DashboardService) {}
}
