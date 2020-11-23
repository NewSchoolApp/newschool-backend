import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Constants } from '../../../CommonsModule/constants';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CourseTakenV2Service } from '../../service/v2/course-taken-v2.service';
import { CourseTaken } from '../../entity/course.taken.entity';

@ApiTags('CourseTakenV2')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_2}/${Constants.COURSE_TAKEN_ENDPOINT}`,
)
export class CourseTakenV2Controller {
  constructor(private readonly service: CourseTakenV2Service) {}

  @Get('/user/:userId')
  public async getAll(@Param('userId') userId: string): Promise<CourseTaken[]> {
    return this.service.getAllByUserId(userId);
  }

  @Post('advance-on-course/user/:userId/course/:courseId')
  public async updateCourseStatus(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ): Promise<void> {
    await this.service.advanceOnCourse(userId, courseId);
  }

  @Post('current-step/user/:userId/course/:courseId')
  public async currentStep(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return await this.service.currentStep(userId, courseId);
  }
}
