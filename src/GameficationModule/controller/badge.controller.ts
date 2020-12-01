import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { Constants } from 'src/CommonsModule/constants';
import { NeedRole } from 'src/CommonsModule/guard/role-metadata.guard';
import { RoleGuard } from 'src/CommonsModule/guard/role.guard';
import { RoleEnum } from 'src/SecurityModule/enum/role.enum';
import { BadgeUpdateDTO } from '../dto/badge-update.dto';
import { BadgeService } from '../service/badge.service';

@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.BADGE_ENDPOINT}`,
)
export class BadgeController {
  constructor(private readonly service: BadgeService) {}

  @Put()
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public badgeUpdate(@Body() body: BadgeUpdateDTO): void {
    this.service.badgeUpdate(
      body.eventName,
      body.eventOrder,
      body.name,
      body.description,
      body.points,
    );
  }
}
