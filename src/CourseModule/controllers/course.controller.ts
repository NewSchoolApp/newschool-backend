import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CourseService } from '../service';
import { Constants, NeedRole, RoleGuard } from '../../CommonsModule';
import { CourseDTO } from '../dto';
import { CourseMapper } from '../mapper';
import { ApiBearerAuth, ApiCreatedResponse, ApiImplicitBody, ApiImplicitQuery, ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { RoleEnum } from '../../SecurityModule/enum';

@ApiUseTags('Course')
@ApiBearerAuth()
@Controller(`${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.COURSE_ENDPOINT}`)
export class CourseController {
  constructor(
    private readonly service: CourseService,
    private readonly mapper: CourseMapper,
  ) {
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ title: 'Get Courses', description: 'Get all Courses' })
  @ApiOkResponse({ type: CourseDTO, isArray: true, description: 'All Courses' })
  @NeedRole(RoleEnum.ADMIN, RoleEnum.ALUNO)
  @UseGuards(RoleGuard)
  public async getAll(): Promise<CourseDTO[]> {
    return this.mapper.toDtoList(await this.service.getAll());
  }

  @Get('/:id')
  @HttpCode(200)
  @ApiOkResponse({ type: CourseDTO })
  @ApiImplicitQuery({ name: 'id', type: Number, required: true, description: 'Course id' })
  @ApiOperation({ title: 'Find Course by id', description: 'Find Course by id' })
  @NeedRole(RoleEnum.ADMIN, RoleEnum.ALUNO)
  @UseGuards(RoleGuard)
  public async findById(@Param('id') id: CourseDTO['id']): Promise<CourseDTO> {
    return this.mapper.toDto(await this.service.findById(id));
  }

 
}