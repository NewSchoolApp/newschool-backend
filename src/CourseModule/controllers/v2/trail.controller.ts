import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Constants } from '../../../CommonsModule/constants';
import { TrailService } from '../../service/v2/trail.service';
import { CMSTrailDTO } from '../../dto/cms-trail.dto';
import { RoleEnum } from '../../../SecurityModule/enum/role.enum';
import { RoleGuard } from '../../../CommonsModule/guard/role.guard';
import { NeedPolicies, NeedRoles } from '../../../CommonsModule/decorator/role-guard-metadata.decorator';

@ApiTags('Trail')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_2}/${Constants.TRAIL_ENDPOINT}`,
)
export class TrailController {
  constructor(private readonly service: TrailService) {}

  @Get()
  @UseGuards(RoleGuard)
  @NeedRoles(RoleEnum.STUDENT)
  @NeedPolicies(`${Constants.POLICIES_PREFIX}/GET_ALL_TRAILS`)
  public getAll(): Promise<CMSTrailDTO[]> {
    return this.service.getAll();
  }

  @Get('/:id')
  @UseGuards(RoleGuard)
  @NeedRoles(RoleEnum.STUDENT)
  @NeedPolicies(`${Constants.POLICIES_PREFIX}/FIND_TRAIL_BY_ID`)
  public findById(@Param('id', ParseIntPipe) id: number): Promise<CMSTrailDTO> {
    return this.service.findById(id);
  }
}
