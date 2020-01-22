import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CourseTakenService } from '../service';
import { Constants, NeedRole, RoleGuard } from '../../CommonsModule';
import {
  AttendAClassDTO,
  CertificateDTO,
  CourseTakenDTO,
  CourseTakenUpdateDTO,
  NewCourseTakenDTO,
} from '../dto';
import { CourseTakenMapper } from '../mapper';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiImplicitBody,
  ApiImplicitParam,
  ApiImplicitQuery,
  ApiOkResponse,
  ApiOperation,
  ApiUseTags,
} from '@nestjs/swagger';
import { RoleEnum } from '../../SecurityModule/enum';
import { UserDTO } from '../../UserModule/dto';

@ApiUseTags('CourseTaken')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.COURSE_TAKEN_ENDPOINT}`,
)
export class CourseTakenController {
  constructor(
    private readonly service: CourseTakenService,
    private readonly mapper: CourseTakenMapper,
  ) {}

  @Get('/user/:user')
  @HttpCode(200)
  @ApiOperation({
    title: 'Get Courses',
    description: 'Get all courses by User id',
  })
  @ApiImplicitQuery({
    name: 'user',
    type: String,
    required: true,
    description: 'User id',
  })
  @ApiOkResponse({
    type: CourseTakenDTO,
    isArray: true,
    description: 'All courses by User id',
  })
  @NeedRole(RoleEnum.ADMIN, RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async getAllByUserId(
    @Param('user') user: CourseTakenDTO['user'],
  ): Promise<CourseTakenDTO[]> {
    return this.mapper.toDtoList(await this.service.getAllByUserId(user));
  }

  @Get('/course/:course')
  @HttpCode(200)
  @ApiOperation({
    title: 'Get Users',
    description: 'Get all users by Course id',
  })
  @ApiImplicitQuery({
    name: 'course',
    type: String,
    required: true,
    description: 'Course id',
  })
  @ApiOkResponse({
    type: CourseTakenDTO,
    isArray: true,
    description: 'All users by Course id',
  })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async getAllCourseId(
    @Param('course') course: CourseTakenDTO['course'],
  ): Promise<CourseTakenDTO[]> {
    return this.mapper.toDtoList(await this.service.getAllByCourseId(course));
  }

  @Get('/:user/:course')
  @HttpCode(200)
  @ApiOkResponse({ type: CourseTakenDTO })
  @ApiImplicitParam({
    name: 'user',
    type: String,
    required: true,
    description: 'User id',
  })
  @ApiImplicitParam({
    name: 'course',
    type: String,
    required: true,
    description: 'Course id',
  })
  @ApiOperation({
    title: 'Find course taken',
    description: 'Find course taken by user id and course id',
  })
  @NeedRole(RoleEnum.ADMIN, RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async findByUserIdAndCourseId(
    @Param('user') user: CourseTakenDTO['user'],
    @Param('course') course: CourseTakenDTO['course'],
  ): Promise<CourseTakenDTO> {
    return this.mapper.toDto(
      await this.service.findByUserIdAndCourseId(user, course),
    );
  }

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: CourseTakenDTO, description: 'Course Taken' })
  @ApiOperation({
    title: 'Add course taken',
    description: 'Creates a new entry on course taken',
  })
  @ApiImplicitBody({ name: 'CourseTaken', type: NewCourseTakenDTO })
  @NeedRole(RoleEnum.ADMIN, RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async add(
    @Body() courseTaken: NewCourseTakenDTO,
  ): Promise<AttendAClassDTO> {
    return await this.service.add(courseTaken);
  }

  @Put('/:user/:course')
  @HttpCode(200)
  @ApiOkResponse({ type: CourseTakenDTO })
  @ApiImplicitParam({
    name: 'user',
    type: String,
    required: true,
    description: 'User id',
  })
  @ApiImplicitParam({
    name: 'course',
    type: String,
    required: true,
    description: 'Course id',
  })
  @ApiOperation({
    title: 'Update course taken',
    description: 'Update course taken by user id and course id',
  })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async update(
    @Param('user') user: CourseTakenDTO['user'],
    @Param('course') course: CourseTakenDTO['course'],
    @Body() courseTakenUpdatedInfo: CourseTakenUpdateDTO,
  ): Promise<CourseTakenDTO> {
    return await this.service.update(user, course, courseTakenUpdatedInfo);
  }

  @Delete('/:user/:course')
  @HttpCode(200)
  @ApiOkResponse({ type: null })
  @ApiImplicitParam({
    name: 'user',
    type: String,
    required: true,
    description: 'User id',
  })
  @ApiImplicitParam({
    name: 'course',
    type: String,
    required: true,
    description: 'Course id',
  })
  @ApiOperation({
    title: 'Delete course taken',
    description: 'Delete course taken by user id and course id',
  })
  @NeedRole(RoleEnum.ADMIN, RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async delete(
    @Param('user') user: CourseTakenDTO['user'],
    @Param('course') course: CourseTakenDTO['course'],
  ): Promise<void> {
    await this.service.delete(user, course);
  }

  @Post('/advance-on-course')
  @HttpCode(201)
  @ApiOkResponse({ type: CourseTakenDTO })
  @ApiImplicitBody({ name: 'CourseTaken', type: CourseTakenDTO })
  @ApiOperation({
    title: 'Update course taken',
    description: 'Update course taken by user id and course id',
  })
  @NeedRole(RoleEnum.ADMIN, RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async updateCourseStatus(
    @Body() courseTaken: CourseTakenDTO,
  ): Promise<AttendAClassDTO> {
    return await this.service.updateCourseStatus(
      courseTaken.user,
      courseTaken.course,
    );
  }

  @Get('/attend-a-class/:user/:course')
  @HttpCode(200)
  @ApiOkResponse({ type: AttendAClassDTO })
  @ApiImplicitParam({
    name: 'user',
    type: String,
    required: true,
    description: 'User id',
  })
  @ApiImplicitParam({
    name: 'course',
    type: String,
    required: true,
    description: 'Course id',
  })
  @ApiOperation({
    title: 'Find course taken',
    description: 'Find course taken by user id and course id',
  })
  @NeedRole(RoleEnum.ADMIN, RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async attendAClass(
    @Param('user') user: CourseTakenDTO['user'],
    @Param('course') course: CourseTakenDTO['course'],
  ): Promise<AttendAClassDTO> {
    return await this.service.attendAClass(user, course);
  }

  @Get('/certificate/user/:userId/course/:courseId')
  @HttpCode(200)
  @ApiOkResponse({ type: CertificateDTO })
  @ApiImplicitParam({
    name: 'userId',
    type: String,
    required: true,
    description: 'User id',
  })
  @ApiImplicitParam({
    name: 'courseId',
    type: String,
    required: true,
    description: 'Course id',
  })
  @ApiOperation({
    title: 'Find certificates by user and course',
    description: 'Find certificates by user id and course id',
  })
  @NeedRole(RoleEnum.ADMIN, RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async getCertificate(
    @Param('userId') userId: CourseTakenDTO['user'],
    @Param('courseId') courseId: CourseTakenDTO['course'],
  ): Promise<CertificateDTO> {
    return await this.service.getCertificate(userId, courseId);
  }

  @Get('/certificates/user/:userId')
  @HttpCode(200)
  @ApiOkResponse({ type: CertificateDTO, isArray: true })
  @ApiImplicitParam({
    name: 'userId',
    type: String,
    required: true,
    description: 'User id',
  })
  @ApiOperation({
    title: 'Find certificates by user',
    description: 'Find certificates by user id',
  })
  @NeedRole(RoleEnum.ADMIN, RoleEnum.STUDENT, RoleEnum.EXTERNAL)
  @UseGuards(RoleGuard)
  public async getCertificates(
    @Param('userId') userId: UserDTO['id'],
  ): Promise<CertificateDTO[]> {
    return await this.service.getCertificates(userId);
  }
}
