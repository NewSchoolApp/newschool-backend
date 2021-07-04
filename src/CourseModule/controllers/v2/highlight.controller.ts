import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Constants } from '../../../CommonsModule/constants';
import { HighlightService } from '../../service/v2/highlight.service';
import { CMSHighlightDTO } from '../../dto/cms-highlight.dto';
import { RoleEnum } from '../../../SecurityModule/enum/role.enum';
import { RoleGuard } from '../../../CommonsModule/guard/role.guard';
import { NeedPolicies, NeedRoles } from '../../../CommonsModule/decorator/role-guard-metadata.decorator';

@ApiTags('Highlight')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_2}/${Constants.PILAR_ENDPOINT}`,
)
export class HighlightController {
  constructor(private readonly service: HighlightService) {}

  @Get()
  @UseGuards(RoleGuard)
  @NeedRoles(RoleEnum.STUDENT)
  @NeedPolicies(`${Constants.POLICIES_PREFIX}/GET_ALL_HIGHLIGHTS`)
  public getAll(): Promise<CMSHighlightDTO[]> {
    return this.service.getAll();
  }

  @Get('/:id')
  @UseGuards(RoleGuard)
  @NeedRoles(RoleEnum.STUDENT)
  @NeedPolicies(`${Constants.POLICIES_PREFIX}/FIND_HIGHLIGHT_BY_ID`)
  public findById(@Param('id', ParseIntPipe) id: number): Promise<CMSHighlightDTO> {
    return this.service.findById(id);
  }
}
