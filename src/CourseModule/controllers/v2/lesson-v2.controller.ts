import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { Constants } from '../../../CommonsModule/constants';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LessonV2Service } from '../../service/v2/lesson-v2.service';
import { CMSLessonDTO } from '../../dto/cms-lesson.dto';

@ApiTags('LessonV2')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_2}/${Constants.LESSON_ENDPOINT}`,
)
export class LessonV2Controller {
  constructor(private readonly service: LessonV2Service) {}

  @Get('course/:courseId')
  public async getAll(
    @Param('courseId', ParseIntPipe) courseId: number,
  ): Promise<CMSLessonDTO[]> {
    return this.service.getAll(courseId);
  }

  @Get(':id')
  public async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CMSLessonDTO> {
    return this.service.findById(id);
  }
}
