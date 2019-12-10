import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from '../service';
import { Constants, NeedRole, RoleGuard } from '../../CommonsModule';
import { ChangePasswordRequestIdDTO, ForgotPasswordDTO, NewUserDTO, UserDTO, UserUpdateDTO } from '../dto';
import { UserMapper } from '../mapper';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiGoneResponse,
  ApiImplicitBody,
  ApiImplicitQuery,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { NewUserSwagger } from '../swagger';
import { RoleEnum } from '../../SecurityModule/enum';

@ApiUseTags('User')
@ApiBearerAuth()
@Controller(`${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.USER_ENDPOINT}`)
export class UserController {
  constructor(
    private readonly service: UserService,
    private readonly mapper: UserMapper,
  ) {
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ title: 'Get Users', description: 'Get all users' })
  @ApiOkResponse({ type: NewUserDTO, isArray: true, description: 'All users' })
  @ApiUnauthorizedResponse({ description: 'thrown if there is not an authorization token or if authorization token does not have ADMIN role' })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async getAll(): Promise<UserDTO[]> {
    return this.mapper.toDtoList(await this.service.getAll());
  }

  @Get('/:id')
  @HttpCode(200)
  @ApiOkResponse({ type: NewUserDTO })
  @ApiImplicitQuery({ name: 'id', type: Number, required: true, description: 'User id' })
  @ApiOperation({ title: 'Find user by id', description: 'Find user by id' })
  @ApiNotFoundResponse({ description: 'thrown if user is not found' })
  @ApiUnauthorizedResponse({ description: 'thrown if there is not an authorization token or if authorization token does not have ADMIN or STUDENT role' })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async findById(@Param('id') id: UserDTO['id']): Promise<UserDTO> {
    return this.mapper.toDto(await this.service.findById(id));
  }

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: NewUserDTO, description: 'User created' })
  @ApiOperation({ title: 'Add user', description: 'Creates a new user' })
  @ApiImplicitBody({ name: 'User', type: NewUserSwagger })
  @ApiUnauthorizedResponse({ description: 'thrown if there is not an authorization token or if authorization token does not have ADMIN role' })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async add(@Body() user: NewUserDTO): Promise<UserDTO> {
    return this.mapper.toDto(await this.service.add(user));
  }

  @Put('/:id')
  @HttpCode(200)
  @ApiImplicitQuery({ name: 'id', type: Number, required: true, description: 'User id' })
  @ApiOperation({ title: 'Update user', description: 'Update user by id' })
  @ApiOkResponse({ type: NewUserDTO })
  @ApiNotFoundResponse({ description: 'thrown if user is not found' })
  @ApiUnauthorizedResponse({ description: 'thrown if there is not an authorization token or if authorization token does not have ADMIN or STUDENT role' })
  @NeedRole(RoleEnum.ADMIN, RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async update(@Param('id') id: UserDTO['id'], @Body() userUpdatedInfo: UserUpdateDTO): Promise<UserDTO> {
    return await this.service.update(id, this.mapper.toEntity(userUpdatedInfo as UserDTO));
  }

  @Post('/forgot-password')
  @HttpCode(200)
  @ApiOkResponse({ type: ChangePasswordRequestIdDTO })
  @ApiOperation({ title: 'Create change password request', description: 'Create change password request' })
  @ApiNotFoundResponse({ description: 'thrown if user is not found' })
  @ApiUnauthorizedResponse({ description: 'thrown if there is not an authorization token or if authorization token does not have EXTERNAL role' })
  @NeedRole(RoleEnum.EXTERNAL)
  @UseGuards(RoleGuard)
  public async forgotPassword(@Body() forgotPasswordDTO: ForgotPasswordDTO): Promise<ChangePasswordRequestIdDTO> {
    const forgotPasswordRequestId = await this.service.forgotPassword(forgotPasswordDTO);
    const changePasswordRequestIdDTO = new ChangePasswordRequestIdDTO();
    changePasswordRequestIdDTO.id = forgotPasswordRequestId;
    return changePasswordRequestIdDTO;
  }

  @Get('/forgot-password/:changePasswordRequestId/validate')
  @HttpCode(200)
  @ApiOperation({
    title: 'Validate change password request',
    description: 'validate change password expiration time. If time is not expired, 200 is returned',
  })
  @ApiGoneResponse({ description: 'thrown if change password request time is up' })
  @ApiNotFoundResponse({ description: 'thrown if change password request is not found' })
  @ApiUnauthorizedResponse({ description: 'thrown if there is not an authorization token or if authorization token does not have EXTERNAL role' })
  // @NeedRole(RoleEnum.EXTERNAL)
  // @UseGuards(RoleGuard)
  public async validateChangePasswordExpirationTime(@Param('changePasswordRequestId') changePasswordRequestId: string) {
    await this.service.validateChangePassword(changePasswordRequestId);
  }

  @Delete('/:id')
  @HttpCode(200)
  @ApiImplicitQuery({ name: 'id', type: Number, required: true, description: 'User id' })
  @ApiOperation({ title: 'Delete user', description: 'Delete user by id' })
  @ApiOkResponse({ type: null })
  @ApiNotFoundResponse({ description: 'thrown if user is not found' })
  @ApiUnauthorizedResponse({ description: 'thrown if there is not an authorization token or if authorization token does not have ADMIN role' })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async delete(@Param('id') id: UserDTO['id']): Promise<void> {
    await this.service.delete(id);
  }
}
