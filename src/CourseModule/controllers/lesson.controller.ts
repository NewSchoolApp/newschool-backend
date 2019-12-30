import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { LessonService } from '../service';
import { Constants, NeedRole, RoleGuard } from '../../CommonsModule';
import { LessonDTO, LessonUpdateDTO, NewLessonDTO } from '../dto';
import { LessonMapper } from '../mapper';
import { ApiBearerAuth, ApiCreatedResponse, ApiImplicitBody, ApiImplicitQuery, ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { RoleEnum } from '../../SecurityModule/enum';

@ApiUseTags('Lesson')
@ApiBearerAuth()
@Controller(`${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.LESSON_ENDPOINT}`)
export class LessonController {
    constructor(
        private readonly service: LessonService,
        private readonly mapper: LessonMapper,
    ) {
    }

    @Get()
    @HttpCode(200)
    @ApiOperation({ title:'Get Lessons', description: 'Get all Lessons' })
    @NeedRole( RoleEnum.ADMIN, RoleEnum.STUDENT )
    @UseGuards( RoleGuard )
    public async getAll(@Param('course') courseId: LessonDTO['course']): Promise<LessonDTO[]> {
        return this.mapper.toDtoList(await this.service.getAll(courseId));
    }

    @Get('/:id')
    @HttpCode(200)
    @ApiOkResponse({ type: LessonDTO })
    @ApiImplicitQuery({ name: 'id', type: String, required: true, description: 'Lesson id' })
    @ApiOperation({ title: 'Find Lesson by id', description: 'Find Lesson by id' })
    @NeedRole(RoleEnum.ADMIN, RoleEnum.STUDENT)
    @UseGuards(RoleGuard)
    public async findById(@Param('id') id: LessonDTO['id']): Promise<LessonDTO> {
        return this.mapper.toDto(await this.service.findById(id));
    }

    @Post()
    @HttpCode(201)
    @ApiCreatedResponse({ type: LessonDTO, description: 'Lesson created' })
    @ApiOperation({ title: 'Add lesson', description: 'Creates a new lesson' })
    @ApiImplicitBody({ name: 'Lesson', type: NewLessonDTO })
    @NeedRole(RoleEnum.ADMIN)
    @UseGuards(RoleGuard)
    public async add(@Body() lesson): Promise<LessonDTO> {
        return this.mapper.toDto(await this.service.add(lesson));
    }

    @Put('/:id')
    @HttpCode(200)
    @ApiOkResponse({ type: LessonDTO })
    @ApiImplicitBody({ name: 'id', type: String, required: true, description: 'Lesson id' })
    @ApiOperation({ title: 'Update course', description: 'Update lesson by id' })
    @NeedRole(RoleEnum.ADMIN)
    @UseGuards(RoleGuard)
    public async update(@Param('id') id: LessonDTO['id'], @Body() lessonUpdatedInfo: LessonUpdateDTO): Promise<LessonDTO> {
        return await this.service.update(id, this.mapper.toEntity(lessonUpdatedInfo as LessonDTO));
    }

    @Delete('/:id')
    @HttpCode(200)
    @ApiOkResponse({ type: null })
    @ApiImplicitQuery({ name: 'id', type: String, required: true, description: 'Lesson id' })
    @ApiOperation({ title: 'Delete lesson', description: 'Delete lesson by id' })
    @NeedRole(RoleEnum.ADMIN)
    @UseGuards(RoleGuard)
    public async delete(@Param('id') id: LessonDTO['id']): Promise<void> {
        await this.service.delete(id);
    }
}
