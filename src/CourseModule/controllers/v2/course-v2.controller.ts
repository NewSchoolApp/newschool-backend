import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CourseV2Service } from '../../service/v2/course-v2.service';
import { CMSCourseDTO } from '../../dto/cms-course.dto';
import { Constants } from '../../../CommonsModule/constants';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('CourseV2')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_2}/${Constants.COURSE_ENDPOINT}`,
)
export class CourseV2Controller {
  constructor(private readonly service: CourseV2Service) {}

  @Get()
  public async getAll(): Promise<CMSCourseDTO[]> {
    return this.service.getAll();
  }

  @Get(':id')
  public async findById(@Param('id') id: string): Promise<CMSCourseDTO> {
    return this.service.findById(id);
  }
}
