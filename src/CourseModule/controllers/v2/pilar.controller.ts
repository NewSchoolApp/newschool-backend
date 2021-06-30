import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Constants } from '../../../CommonsModule/constants';
import { PilarService } from '../../service/v2/pilar.service';
import { CMSPilarDTO } from '../../dto/cms-pilar.dto';
import { RoleEnum } from '../../../SecurityModule/enum/role.enum';
import { RoleGuard } from '../../../CommonsModule/guard/role.guard';
import { NeedPolicies, NeedRoles } from '../../../CommonsModule/decorator/role-guard-metadata.decorator';

@ApiTags('Pilar')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_2}/${Constants.PILAR_ENDPOINT}`,
)
export class PilarController {
  constructor(private readonly service: PilarService) {}

  @Get()
  @UseGuards(RoleGuard)
  @NeedRoles(RoleEnum.STUDENT)  
  public getAll(): Promise<CMSPilarDTO[]> {
    return this.service.getAll();
  }

  @Get('/:id')
  @UseGuards(RoleGuard)
  @NeedRoles(RoleEnum.STUDENT)
  @NeedPolicies(`${Constants.POLICIES_PREFIX}/FIND_PILAR_BY_ID`)
  public findById(@Param('id', ParseIntPipe) id: number): Promise<CMSPilarDTO> {
    return this.service.findById(id);
  }
}
