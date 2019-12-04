import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from '../service';
import { Constants, NeedRole, RoleGuard } from '../../CommonsModule';
import { NewUserDTO, UserDTO } from '../dto/user.dto';
import { UserMapper } from '../mapper';
import { ApiBearerAuth, ApiCreatedResponse, ApiImplicitBody, ApiImplicitQuery, ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { UserUpdateDTO } from '../dto/user-update.dto';
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
  @ApiOkResponse({ type: UserDTO, isArray: true, description: 'All users' })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async getAll(): Promise<UserDTO[]> {
    return this.mapper.toDtoList(await this.service.getAll());
  }

  @Get('/:id')
  @HttpCode(200)
  @ApiOkResponse({ type: UserDTO })
  @ApiImplicitQuery({ name: 'id', type: Number, required: true, description: 'User id' })
  @ApiOperation({ title: 'Find user by id', description: 'Find user by id' })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async findById(@Param('id') id: UserDTO['id']): Promise<UserDTO> {
    return this.mapper.toDto(await this.service.findById(id));
  }

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: UserDTO, description: 'User created' })
  @ApiOperation({ title: 'Add user', description: 'Creates a new user' })
  @ApiImplicitBody({ name: 'User', type: NewUserSwagger })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async add(@Body() user: NewUserDTO): Promise<UserDTO> {
    return this.mapper.toDto(await this.service.add(user));
  }

  @Put('/:id')
  @HttpCode(200)
  @ApiOkResponse({ type: UserDTO })
  @ApiImplicitQuery({ name: 'id', type: Number, required: true, description: 'User id' })
  @ApiOperation({ title: 'Update user', description: 'Update user by id' })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async update(@Param('id') id: UserDTO['id'], @Body() userUpdatedInfo: UserUpdateDTO): Promise<void> {
    await this.service.update(id, this.mapper.toEntity(userUpdatedInfo as UserDTO));
  }

  @Delete('/:id')
  @HttpCode(200)
  @ApiOkResponse({ type: null })
  @ApiImplicitQuery({ name: 'id', type: Number, required: true, description: 'User id' })
  @ApiOperation({ title: 'Delete user', description: 'Delete user by id' })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async delete(@Param('id') id: UserDTO['id']): Promise<void> {
    await this.service.delete(id);
  }
}
