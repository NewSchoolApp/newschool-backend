import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Constants } from '../../../CommonsModule/constants';
import { TrailService } from '../../service/v2/trail.service';
import { CMSTrailDTO } from '../../dto/cms-trail.dto';
import { NeedRole } from '../../../CommonsModule/guard/role-metadata.guard';
import { RoleEnum } from '../../../SecurityModule/enum/role.enum';
import { RoleGuard } from '../../../CommonsModule/guard/role.guard';

@ApiTags('Pilar')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_2}/${Constants.TRAIL_ENDPOINT}`,
)
export class TrailController {
  constructor(private readonly service: TrailService) {}

  @Get()
  @NeedRole(RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public getAll(): Promise<CMSTrailDTO[]> {
    return this.service.getAll();
  }

  @Get('/:id')
  @NeedRole(RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public findById(@Param('id', ParseIntPipe) id: number): Promise<CMSTrailDTO> {
    return this.service.findById(id);
  }
}
