import {
  Controller,
  Logger,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { DashboardService } from '../service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller(
  
)
export class DashboardController {
  private readonly logger = new Logger(DashboardController.name);

  constructor(private readonly service: DashboardService) {}

  
}