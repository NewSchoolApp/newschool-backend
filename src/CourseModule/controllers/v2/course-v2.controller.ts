import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CourseV2Service } from '../../service/v2/course-v2.service';
import { CMSCourseDTO } from '../../dto/cms-course.dto';
import { Constants } from '../../../CommonsModule/constants';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NeedRole } from '../../../CommonsModule/guard/role-metadata.guard';
import { RoleEnum } from '../../../SecurityModule/enum/role.enum';
import { RoleGuard } from '../../../CommonsModule/guard/role.guard';

@ApiTags('CourseV2')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_2}/${Constants.COURSE_ENDPOINT}`,
)
export class CourseV2Controller {
  constructor(private readonly service: CourseV2Service) {}

  @Get()
  @NeedRole(RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async getAll(): Promise<CMSCourseDTO[]> {
    return this.service.getAll();
  }

  @Get(':id')
  @NeedRole(RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CMSCourseDTO> {
    return this.service.findById(id);
  }
}
