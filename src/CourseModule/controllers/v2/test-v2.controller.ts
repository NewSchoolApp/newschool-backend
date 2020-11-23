import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Constants } from '../../../CommonsModule/constants';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CMSLessonDTO } from '../../dto/cms-lesson.dto';
import { PartV2Service } from '../../service/v2/part-v2.service';
import {
  CheckTestBodyDTO,
  CheckTestResponseDTO,
} from '../../dto/check-test.dto';
import { CMSTestDTO } from '../../dto/cms-test.dto';

@ApiTags('TestV2')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_2}/${Constants.TEST_ENDPOINT}`,
)
export class PartV2Controller {
  constructor(private readonly service: PartV2Service) {}

  @Get('part/:partId')
  public async getAll(
    @Param('partId', ParseIntPipe) partId: number,
  ): Promise<CMSLessonDTO[]> {
    return this.service.getAll(partId);
  }

  @Get(':id')
  public async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CMSTestDTO> {
    return this.service.findById(id);
  }

  @Post(':id/check-test')
  public async checkTest(
    @Param('id', ParseIntPipe) id: number,
    @Body() checkTest: CheckTestBodyDTO,
  ): Promise<CheckTestResponseDTO> {
    return {
      isCorrect: await this.service.checkTest(id, checkTest.chosenAlternative),
    };
  }
}
