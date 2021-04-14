import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { Constants } from '../../../CommonsModule/constants';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CourseTakenV2Service } from '../../service/v2/course-taken-v2.service';
import { CourseTaken } from '../../entity/course-taken.entity';
import { CurrentStepDTO } from '../../dto/current-step.dto';
import { NewCourseTakenDTO } from '../../dto/new-course.taken.dto';
import { RoleEnum } from '../../../SecurityModule/enum/role.enum';
import { RoleGuard } from '../../../CommonsModule/guard/role.guard';
import { StudentGuard } from '../../../CommonsModule/guard/student.guard';
import { UserIdParam } from '../../../CommonsModule/guard/student-metadata.guard';
import { NpsCourseTakenDTO } from '../../dto/nps-course-taken.dto';
import { ChallengeDTO } from '../../../GameficationModule/dto/challenge.dto';
import { PageableDTO } from '../../../CommonsModule/dto/pageable.dto';
import { CourseTakenDTO } from 'src/CourseModule/dto/course-taken.dto';
import { NeedPolicies, NeedRoles } from '../../../CommonsModule/decorator/role-guard-metadata.decorator';

@ApiTags('CourseTakenV2')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_2}/${Constants.COURSE_TAKEN_ENDPOINT}`,
)
export class CourseTakenV2Controller {
  constructor(private readonly service: CourseTakenV2Service) {}

  @Get('/user/:userId')
  @UseGuards(RoleGuard, StudentGuard)
  @NeedRoles(RoleEnum.STUDENT)
  @NeedPolicies(`${Constants.POLICIES_PREFIX}/GET_ALL_COURSES_TAKEN_BY_USER_ID`)
  @UserIdParam('userId')
  public async getAllByUserId(
    @Param('userId') userId: string,
  ): Promise<CourseTaken[]> {
    return this.service.getAllByUserId(userId);
  }

  @Post('start-course')
  @NeedRoles(RoleEnum.STUDENT)
  @NeedPolicies(`${Constants.POLICIES_PREFIX}/START_COURSE`)
  @UseGuards(RoleGuard)
  public async startCourse(
    @Body() { userId, courseId }: NewCourseTakenDTO,
  ): Promise<void> {
    await this.service.startCourse(userId, courseId);
  }

  @Post('advance-on-course/user/:userId/course/:courseId')
  @UseGuards(RoleGuard, StudentGuard)
  @NeedRoles(RoleEnum.STUDENT)
  @NeedPolicies(`${Constants.POLICIES_PREFIX}/ADVANCE_ON_COURSE`)
  @UserIdParam('userId')
  public async advanceOnCourse(
    @Param('userId') userId: string,
    @Param('courseId', ParseIntPipe) courseId: number,
  ): Promise<void> {
    await this.service.advanceOnCourse(userId, courseId);
  }

  @Get('current-step/user/:userId/course/:courseId')
  @UseGuards(RoleGuard, StudentGuard)
  @NeedRoles(RoleEnum.STUDENT)
  @NeedPolicies(`${Constants.POLICIES_PREFIX}/GET_CURRENT_STEP`)
  @UserIdParam('userId')
  public async currentStep(
    @Param('userId') userId: string,
    @Param('courseId', ParseIntPipe) courseId: number,
  ): Promise<CurrentStepDTO> {
    return await this.service.currentStep(userId, courseId);
  }

  @Get('certificate/user/:userId')
  @UseGuards(RoleGuard, StudentGuard)
  @NeedRoles(RoleEnum.STUDENT)
  @NeedPolicies(`${Constants.POLICIES_PREFIX}/GET_CERTIFICATES`)
  @UserIdParam('userId')
  public async getCertificates(@Param('userId') userId: string) {
    return await this.service.getCertificates(userId);
  }

  @Get('certificate/user/:userId/course/:courseId')
  @UseGuards(RoleGuard, StudentGuard)
  @NeedRoles(RoleEnum.STUDENT, RoleEnum.EXTERNAL)
  @NeedPolicies(`${Constants.POLICIES_PREFIX}/GET_CERTIFICATE`)
  @UserIdParam('userId')
  public async getCertificate(
    @Param('userId') userId: string,
    @Param('courseId') courseId: number,
  ) {
    return await this.service.getCertificate(userId, courseId);
  }

  @Post('nps/user/:userId/course/:courseId')
  @UseGuards(RoleGuard, StudentGuard)
  @NeedRoles(RoleEnum.STUDENT)
  @NeedPolicies(`${Constants.POLICIES_PREFIX}/AVALIATE_COURSE`)
  @UserIdParam('userId')
  public async avaliateCourse(
    @Param('userId') userId: string,
    @Param('courseId') courseId: number,
    @Body() avaliation: NpsCourseTakenDTO,
  ): Promise<void> {
    await this.service.avaliateCourse(userId, courseId, avaliation);
  }

  @Post('challenge/user/:userId/course/:courseId')
  @UseGuards(RoleGuard, StudentGuard)
  @NeedRoles(RoleEnum.STUDENT)
  @NeedPolicies(`${Constants.POLICIES_PREFIX}/SEND_CHALLENGE`)
  @UserIdParam('userId')
  public async sendChallenge(
    @Param('userId') userId: string,
    @Param('courseId') courseId: number,
    @Body() data: ChallengeDTO,
  ): Promise<void> {
    await this.service.sendChallenge(userId, courseId, data);
  }

  @Get('/challenge/course/:courseId')
  @UseGuards(RoleGuard)
  @NeedRoles(RoleEnum.STUDENT)
  @NeedPolicies(`${Constants.POLICIES_PREFIX}/FIND_CHALLENGES`)
  public async findChallenges(
    @Param('courseId') courseId: string,
    @Query('limit') limit = 10,
    @Query('page') page = 1,
  ): Promise<PageableDTO<CourseTakenDTO>> {
    return await this.service.findChallenges(courseId, { limit, page });
  }
}
