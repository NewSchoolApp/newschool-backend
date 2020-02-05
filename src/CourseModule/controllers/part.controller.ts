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
import { PartService } from '../service';
import { Constants, NeedRole, RoleGuard } from '../../CommonsModule';
import { NewPartDTO, PartDTO, PartUpdateDTO } from '../dto';
import { PartMapper } from '../mapper';
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

@ApiTags('Part')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.PART_ENDPOINT}`,
)
export class PartController {
  constructor(
    private readonly service: PartService,
    private readonly mapper: PartMapper,
  ) {}

  @Get('lesson/:lesson')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get Parts', description: 'Get all Parts' })
  @ApiOkResponse({ type: PartDTO, isArray: true, description: 'All courses' })
  @ApiParam({
    name: 'lesson',
    type: String,
    required: true,
    description: 'Lesson id',
  })
  @NeedRole(RoleEnum.ADMIN, RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async getAll(
    @Param('lesson') lessonId: PartDTO['lesson'],
  ): Promise<PartDTO[]> {
    return this.mapper.toDtoList(await this.service.getAll(lessonId));
  }

  @Get('/:id')
  @HttpCode(200)
  @ApiOkResponse({ type: PartDTO })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Part id',
  })
  @ApiOperation({ summary: 'Find Part by id', description: 'Find Part by id' })
  @NeedRole(RoleEnum.ADMIN, RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async findById(@Param('id') id: PartDTO['id']): Promise<PartDTO> {
    return this.mapper.toDto(await this.service.findById(id));
  }

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: PartDTO, description: 'Part created' })
  @ApiOperation({ summary: 'Add part', description: 'Creates a new part' })
  @ApiBody({ type: NewPartDTO })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async add(@Body() part: NewPartDTO): Promise<PartDTO> {
    return this.mapper.toDto(await this.service.add(part));
  }

  @Put(':id')
  @HttpCode(200)
  @ApiOkResponse({ type: PartDTO })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Part id',
  })
  @ApiOperation({ summary: 'Update part', description: 'Update part by id' })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async update(
    @Param('id') id: PartDTO['id'],
    @Body() partUpdatedInfo: PartUpdateDTO,
  ): Promise<PartDTO> {
    return await this.service.update(id, partUpdatedInfo);
  }

  @Delete('/:id')
  @HttpCode(200)
  @ApiOkResponse({ type: null })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Part id',
  })
  @ApiOperation({ summary: 'Delete part', description: 'Delete part by id' })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async delete(@Param('id') id: PartDTO['id']): Promise<void> {
    await this.service.delete(id);
  }
}
