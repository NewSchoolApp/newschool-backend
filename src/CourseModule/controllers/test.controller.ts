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
import { TestService } from '../service';
import { Constants, NeedRole, RoleGuard } from '../../CommonsModule';
import { NewTestDTO, TestDTO, TestUpdateDTO } from '../dto';
import { TestMapper } from '../mapper';
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

@ApiTags('Test')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.TEST_ENDPOINT}`,
)
export class TestController {
  constructor(
    private readonly service: TestService,
    private readonly mapper: TestMapper,
  ) {}

  @Get('/part/:part')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get Tests', description: 'Get all Tests by Part' })
  @ApiOkResponse({
    type: TestDTO,
    isArray: true,
    description: 'All Tests by Part',
  })
  @ApiParam({
    name: 'part',
    type: String,
    required: true,
    description: 'Part id',
  })
  @NeedRole(RoleEnum.ADMIN, RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async getAll(
    @Param('part') part: TestDTO['part'],
  ): Promise<TestDTO[]> {
    return this.mapper.toDtoList(await this.service.getAll(part));
  }

  @Get('/:id')
  @HttpCode(200)
  @ApiOkResponse({ type: TestDTO })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Part id',
  })
  @ApiOperation({ summary: 'Find Test by id', description: 'Find test by id' })
  @NeedRole(RoleEnum.ADMIN, RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async findById(@Param('id') id: TestDTO['id']): Promise<TestDTO> {
    return this.mapper.toDto(await this.service.findById(id));
  }

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: TestDTO, description: 'Test created' })
  @ApiOperation({ summary: 'Add test', description: 'Creates a new test' })
  @ApiBody({ type: NewTestDTO })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async add(@Body() test: NewTestDTO): Promise<TestDTO> {
    return this.mapper.toDto(await this.service.add(test));
  }

  @Put('/:id')
  @HttpCode(200)
  @ApiOkResponse({ type: TestDTO })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Test id',
  })
  @ApiOperation({ summary: 'Update test', description: 'Update test by id' })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async update(
    @Param('id') id: TestDTO['id'],
    @Body() testUpdatedInfo: TestUpdateDTO,
  ): Promise<TestDTO> {
    return await this.service.update(id, testUpdatedInfo);
  }

  @Delete('/:id')
  @HttpCode(200)
  @ApiOkResponse({ type: null })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Test id',
  })
  @ApiOperation({ summary: 'Delete test', description: 'Delete test by id' })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async delete(@Param('id') id: TestDTO['id']): Promise<void> {
    await this.service.delete(id);
  }

  @Get(':id/checkTest/alternative/:chosenAlternative')
  @HttpCode(200)
  @ApiOkResponse({ type: Boolean })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Test id',
  })
  @ApiParam({
    name: 'chosenAlternative',
    type: String,
    required: true,
    description: 'chosenAlternative',
  })
  @ApiOperation({
    summary: 'Check test answer',
    description: 'Check test by test id and chosen alternative',
  })
  @NeedRole(RoleEnum.ADMIN, RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async checkTest(
    @Param('id') id: TestDTO['id'],
    @Param('chosenAlternative') chosenAlternative: string,
  ): Promise<boolean> {
    return await this.service.checkTest(id, chosenAlternative);
  }
}
