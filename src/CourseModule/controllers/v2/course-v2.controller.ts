import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CourseV2Service } from '../../service/v2/course-v2.service';
import { CMSCourseDTO } from '../../dto/cms-course.dto';
import { Constants } from '../../../CommonsModule/constants';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from '../../../SecurityModule/enum/role.enum';
import { RoleGuard } from '../../../CommonsModule/guard/role.guard';
import { NeedPolicies, NeedRoles } from '../../../CommonsModule/decorator/role-guard-metadata.decorator';

@ApiTags('CourseV2')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_2}/${Constants.COURSE_ENDPOINT}`,
)
export class CourseV2Controller {
  constructor(private readonly service: CourseV2Service) {}

  @Get()
  @UseGuards(RoleGuard)
  @NeedRoles(RoleEnum.STUDENT)
  @NeedPolicies(`${Constants.POLICIES_PREFIX}/GET_ALL_COURSES`)
  public async getAll(): Promise<CMSCourseDTO[]> {
    return this.service.getAll();
  }

  @Get(':id')
  @UseGuards(RoleGuard)
  @NeedRoles(RoleEnum.STUDENT)
  @NeedPolicies(`${Constants.POLICIES_PREFIX}/FIND_COURSE_BY_ID`)
  public async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CMSCourseDTO> {
    return this.service.findById(id);
  }
}
