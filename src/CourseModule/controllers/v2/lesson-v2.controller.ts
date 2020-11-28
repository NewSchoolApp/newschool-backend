import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { Constants } from '../../../CommonsModule/constants';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LessonV2Service } from '../../service/v2/lesson-v2.service';
import { CMSLessonDTO } from '../../dto/cms-lesson.dto';
import { NeedRole } from '../../../CommonsModule/guard/role-metadata.guard';
import { RoleEnum } from '../../../SecurityModule/enum/role.enum';
import { RoleGuard } from '../../../CommonsModule/guard/role.guard';

@ApiTags('LessonV2')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_2}/${Constants.LESSON_ENDPOINT}`,
)
export class LessonV2Controller {
  constructor(private readonly service: LessonV2Service) {}

  @Get('course/:courseId')
  @NeedRole(RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async getAll(
    @Param('courseId', ParseIntPipe) courseId: number,
  ): Promise<CMSLessonDTO[]> {
    return this.service.getAll(courseId);
  }

  @Get(':id')
  @NeedRole(RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CMSLessonDTO> {
    return this.service.findById(id);
  }
}
