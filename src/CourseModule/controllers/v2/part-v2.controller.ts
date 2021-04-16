import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { Constants } from '../../../CommonsModule/constants';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PartV2Service } from '../../service/v2/part-v2.service';
import { CMSPartDTO } from '../../dto/cms-part.dto';
import { RoleEnum } from '../../../SecurityModule/enum/role.enum';
import { RoleGuard } from '../../../CommonsModule/guard/role.guard';
import { NeedPolicies, NeedRoles } from '../../../CommonsModule/decorator/role-guard-metadata.decorator';

@ApiTags('PartV2')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_2}/${Constants.PART_ENDPOINT}`,
)
export class PartV2Controller {
  constructor(private readonly service: PartV2Service) {}

  @Get('lesson/:lessonId')
  @UseGuards(RoleGuard)
  @NeedRoles(RoleEnum.STUDENT)
  @NeedPolicies(`${Constants.POLICIES_PREFIX}/GET_PARTS_BY_LESSON_ID`)
  public async getAllByLessonId(
    @Param('lessonId', ParseIntPipe) lessonId: number,
  ): Promise<CMSPartDTO[]> {
    return this.service.getAll(lessonId);
  }

  @Get(':id')
  @UseGuards(RoleGuard)
  @NeedRoles(RoleEnum.STUDENT)
  @NeedPolicies(`${Constants.POLICIES_PREFIX}/FIND_PART_BY_ID`)
  public async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CMSPartDTO> {
    return this.service.findById(id);
  }
}
