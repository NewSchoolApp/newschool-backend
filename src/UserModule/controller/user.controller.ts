import {
  Body,
  Controller,
  forwardRef,
  Get,
  Headers,
  HttpCode,
  Inject,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { UserService } from '../service/user.service';
import { UserMapper } from '../mapper/user.mapper';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiGoneResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RoleEnum } from '../../SecurityModule/enum/role.enum';
import { SecurityService } from '../../SecurityModule/service/security.service';
import { User } from '../entity/user.entity';
import { CertificateUserDTO } from '../dto/certificate-user.dto';
import { AdminChangePasswordDTO } from '../dto/admin-change-password.dto';
import { ChangePasswordRequestIdDTO } from '../dto/change-password-request-id.dto';
import { ForgotPasswordDTO } from '../dto/forgot-password';
import { ChangePasswordForgotFlowDTO } from '../dto/change-password-forgot-flow.dto';
import { UserDTO } from '../dto/user.dto';
import { NewUserDTO } from '../dto/new-user.dto';
import { UserUpdateDTO } from '../dto/user-update.dto';
import { NewStudentDTO } from '../dto/new-student.dto';
import { Constants } from '../../CommonsModule/constants';
import { NeedRole } from '../../CommonsModule/guard/role-metadata.guard';
import { RoleGuard } from '../../CommonsModule/guard/role.guard';
import { BadgeWithQuantityDTO } from '../../GameficationModule/dto/badge-with-quantity.dto';
import { NewUserSwagger } from '../swagger/new-user.swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserIdParam } from '../../CommonsModule/guard/student-metadata.guard';
import { StudentGuard } from '../../CommonsModule/guard/student.guard';

@ApiTags('User')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.USER_ENDPOINT}`,
)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly service: UserService,
    private readonly mapper: UserMapper,
    @Inject(forwardRef(() => SecurityService))
    private readonly securityService: SecurityService,
  ) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get Users', description: 'Get all users' })
  @ApiOkResponse({ type: NewUserDTO, isArray: true, description: 'All users' })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have ADMIN role',
  })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async getAll(): Promise<UserDTO[]> {
    return this.mapper.toDtoList(await this.service.getAll());
  }

  @Get('/:id/badge')
  @HttpCode(200)
  @ApiOkResponse({ type: UserDTO })
  @ApiOperation({
    summary: 'Find user badges by user id',
    description: 'Decodes de jwt and finds the user badges by the user id',
  })
  @ApiNotFoundResponse({ description: 'thrown if user is not found' })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have ADMIN role',
  })
  @UserIdParam('id')
  @UseGuards(StudentGuard)
  @NeedRole(RoleEnum.ADMIN, RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async findBadgesWithQuantityByUserId(
    @Param('id') id: string,
  ): Promise<BadgeWithQuantityDTO[]> {
    this.logger.log(`user id: ${id}`);
    return await this.service.findBadgesWithQuantityByUserId(id);
  }

  @Get(':id/photo')
  @HttpCode(200)
  @UserIdParam('id')
  @UseGuards(StudentGuard)
  @NeedRole(RoleEnum.ADMIN, RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async getUserPhoto(@Param('id') id: string): Promise<string> {
    return this.service.getUserPhoto(id);
  }

  @Post(':id/photo')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(200)
  @UserIdParam('id')
  @UseGuards(StudentGuard)
  @NeedRole(RoleEnum.ADMIN, RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async uploadUserPhoto(
    @UploadedFile('file') file: Express.Multer.File,
    @Param('id') id: string,
  ): Promise<void> {
    return this.service.uploadUserPhoto(file, id);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOkResponse({ type: NewUserDTO })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'User id',
  })
  @ApiOperation({ summary: 'Find user by id', description: 'Find user by id' })
  @ApiNotFoundResponse({ description: 'thrown if user is not found' })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have ADMIN role',
  })
  @UserIdParam('id')
  @UseGuards(StudentGuard)
  @NeedRole(RoleEnum.ADMIN, RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async findById(@Param('id') id: UserDTO['id']): Promise<UserDTO> {
    this.logger.log(`user id: ${id}`);
    return this.mapper.toDtoAsync(await this.service.findById(id));
  }

  @Post()
  @HttpCode(201)
  @Transactional()
  @ApiCreatedResponse({ type: NewUserSwagger, description: 'User created' })
  @ApiOperation({ summary: 'Add user', description: 'Creates a new user' })
  @ApiBody({ type: NewUserDTO })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have ADMIN role',
  })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async add(@Body() user: NewUserDTO): Promise<UserDTO> {
    this.logger.log(`user: ${user}`);
    return this.mapper.toDto(await this.service.add(user));
  }

  @Post('/student')
  @HttpCode(201)
  @Transactional()
  @ApiCreatedResponse({ type: NewUserDTO, description: 'User student created' })
  @ApiOperation({
    summary: 'Add student user',
    description: 'Creates a new student',
  })
  @ApiBody({ type: NewStudentDTO })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have EXTERNAL role',
  })
  @NeedRole(RoleEnum.ADMIN, RoleEnum.EXTERNAL)
  @UseGuards(RoleGuard)
  public async addStudent(
    @Body() user: NewStudentDTO,
    @Query('inviteKey') inviteKey?: string,
  ): Promise<UserDTO> {
    this.logger.log(`user: ${user}`);
    return this.mapper.toDto(
      await this.service.addStudent(
        { ...user, role: RoleEnum.STUDENT },
        inviteKey,
      ),
    );
  }

  @Put(':id')
  @HttpCode(200)
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'User id',
  })
  @ApiOperation({ summary: 'Update user', description: 'Update user by id' })
  @ApiOkResponse({ type: UserDTO })
  @ApiNotFoundResponse({ description: 'thrown if user is not found' })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have ADMIN role',
  })
  @UserIdParam('id')
  @UseGuards(StudentGuard)
  @NeedRole(RoleEnum.ADMIN, RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async update(
    @Param('id') id: string,
    @Body() userUpdatedInfo: UserUpdateDTO,
  ): Promise<UserDTO> {
    this.logger.log(`user id: ${id}, new user information: ${userUpdatedInfo}`);
    return this.mapper.toDto(await this.service.update(id, userUpdatedInfo));
  }

  @Put(':id/change-password')
  @HttpCode(200)
  @ApiOkResponse({ type: UserDTO })
  @ApiOperation({
    summary: 'change-password',
    description: 'Changes password from an authenticated user',
  })
  @ApiNotFoundResponse({ description: 'thrown if user is not found' })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have ADMIN role',
  })
  @UserIdParam('id')
  @UseGuards(StudentGuard)
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async changeUserPassword(
    @Param('id') id: string,
    @Body() changePassword: AdminChangePasswordDTO,
  ): Promise<UserDTO> {
    this.logger.log(`user id: ${id}`);
    return this.mapper.toDto(
      await this.service.adminChangePassword(id, changePassword),
    );
  }

  @Post('/forgot-password')
  @HttpCode(200)
  @Transactional()
  @ApiOkResponse({ type: ChangePasswordRequestIdDTO })
  @ApiOperation({
    summary: 'Create change password request',
    description: 'Create change password request',
  })
  @ApiNotFoundResponse({ description: 'thrown if user is not found' })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have EXTERNAL role',
  })
  @NeedRole(RoleEnum.ADMIN, RoleEnum.EXTERNAL)
  @UseGuards(RoleGuard)
  public async forgotPassword(
    @Body() forgotPasswordDTO: ForgotPasswordDTO,
  ): Promise<ChangePasswordRequestIdDTO> {
    this.logger.log(`forgot password: ${forgotPasswordDTO}`);
    const forgotPasswordRequestId = await this.service.forgotPassword(
      forgotPasswordDTO,
    );
    const changePasswordRequestIdDTO = new ChangePasswordRequestIdDTO();
    changePasswordRequestIdDTO.id = forgotPasswordRequestId;
    return changePasswordRequestIdDTO;
  }

  @Get('/forgot-password/:changePasswordRequestId/validate')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Validate change password request',
    description:
      'validate change password expiration time. If time is not expired, 200 is returned',
  })
  @ApiGoneResponse({
    description: 'thrown if change password request time is up',
  })
  @ApiNotFoundResponse({
    description: 'thrown if change password request is not found',
  })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have EXTERNAL role',
  })
  @NeedRole(RoleEnum.ADMIN, RoleEnum.EXTERNAL)
  @UseGuards(RoleGuard)
  public async validateChangePasswordExpirationTime(
    @Param('changePasswordRequestId') changePasswordRequestId: string,
  ): Promise<void> {
    this.logger.log(`change password request id: ${changePasswordRequestId}`);
    await this.service.validateChangePassword(changePasswordRequestId);
  }

  @Post('/forgot-password/:changePasswordRequestId')
  @HttpCode(200)
  @ApiOperation({
    summary: 'change password on forgot password flow',
  })
  @ApiNotFoundResponse({
    description: 'thrown if change password request is not found',
  })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have EXTERNAL role',
  })
  @NeedRole(RoleEnum.ADMIN, RoleEnum.EXTERNAL)
  @UseGuards(RoleGuard)
  public async changePassword(
    @Param('changePasswordRequestId') changePasswordRequestId: string,
    @Body() changePasswordDTO: ChangePasswordForgotFlowDTO,
  ): Promise<void> {
    this.logger.log(
      `change password request id: ${changePasswordRequestId}, change password information: ${changePasswordDTO}`,
    );
    await this.service.changePasswordForgotPasswordFlow(
      changePasswordRequestId,
      changePasswordDTO,
    );
  }

  @Get(':id/certificate')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get Certificates',
    description: 'Get All Certificates',
  })
  @ApiOkResponse({
    type: CertificateUserDTO,
    isArray: true,
    description: 'All Certificates',
  })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have ADMIN role',
  })
  @UserIdParam('id')
  @UseGuards(StudentGuard)
  @NeedRole(RoleEnum.ADMIN, RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async findCertificatesByUser(
    @Param('id') id: string,
  ): Promise<CertificateUserDTO[]> {
    return await this.service.getCertificateByUser(id);
  }
}
