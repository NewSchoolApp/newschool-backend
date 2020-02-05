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
import { LessonService } from '../service';
import { Constants, NeedRole, RoleGuard } from '../../CommonsModule';
import { LessonDTO, LessonUpdateDTO, NewLessonDTO } from '../dto';
import { LessonMapper } from '../mapper';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { RoleEnum } from '../../SecurityModule/enum';
import { Course } from '../entity';

@ApiTags('Lesson')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.LESSON_ENDPOINT}`,
)
export class LessonController {
  constructor(
    private readonly service: LessonService,
    private readonly mapper: LessonMapper,
  ) {}

  @Get('/course/:courseId')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get Lessons',
    description: 'Get all Lessons by Course',
  })
  @ApiOkResponse({
    type: LessonDTO,
    isArray: true,
    description: 'All Lessons by Course',
  })
  @ApiParam({
    name: 'course',
    type: String,
    required: true,
    description: 'Course id',
  })
  @NeedRole(RoleEnum.ADMIN, RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async getAll(
    @Param('courseId') courseId: Course['id'],
  ): Promise<LessonDTO[]> {
    return this.mapper.toDtoList(await this.service.getAll(courseId));
  }

  @Get('/:id')
  @HttpCode(200)
  @ApiOkResponse({ type: LessonDTO })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Lesson id',
  })
  @ApiOperation({
    summary: 'Find Lesson by id',
    description: 'Find Lesson by id',
  })
  @NeedRole(RoleEnum.ADMIN, RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async findById(@Param('id') id: LessonDTO['id']): Promise<LessonDTO> {
    return this.mapper.toDto(await this.service.findById(id));
  }

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: LessonDTO, description: 'Lesson created' })
  @ApiOperation({ summary: 'Add lesson', description: 'Creates a new lesson' })
  @ApiBody({ type: NewLessonDTO })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async add(@Body() lesson: NewLessonDTO): Promise<LessonDTO> {
    return this.mapper.toDto(await this.service.add(lesson));
  }

  @Put(':id')
  @HttpCode(200)
  @ApiOkResponse({ type: LessonDTO })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Lesson id',
  })
  @ApiOperation({
    summary: 'Update lesson',
    description: 'Update lesson by id',
  })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async update(
    @Param('id') id: LessonDTO['id'],
    @Body() lessonUpdatedInfo: LessonUpdateDTO,
  ): Promise<LessonDTO> {
    return await this.service.update(id, lessonUpdatedInfo);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOkResponse({ type: null })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Lesson id',
  })
  @ApiOperation({
    summary: 'Delete lesson',
    description: 'Delete lesson by id',
  })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async delete(@Param('id') id: LessonDTO['id']): Promise<void> {
    await this.service.delete(id);
  }
}
