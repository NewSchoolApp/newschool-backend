import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { Constants } from '../../../CommonsModule/constants';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CheckTestBodyDTO, CheckTestResponseDTO } from '../../dto/check-test.dto';
import { CMSTestDTO } from '../../dto/cms-test.dto';
import { TestV2Service } from '../../service/v2/test-v2.service';
import { RoleEnum } from '../../../SecurityModule/enum/role.enum';
import { RoleGuard } from '../../../CommonsModule/guard/role.guard';
import { NeedPolicies, NeedRoles } from '../../../CommonsModule/decorator/role-guard-metadata.decorator';

@ApiTags('TestV2')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_2}/${Constants.TEST_ENDPOINT}`,
)
export class TestV2Controller {
  constructor(private readonly service: TestV2Service) {}

  @Get('part/:partId')
  @UseGuards(RoleGuard)
  @NeedRoles(RoleEnum.STUDENT)
  @NeedPolicies(`${Constants.POLICIES_PREFIX}/GET_ALL_TESTS_BY_PART_ID`)
  public async getAllByPartId(
    @Param('partId', ParseIntPipe) partId: number,
  ): Promise<CMSTestDTO[]> {
    return this.service.getAll(partId);
  }

  @Get(':id')
  @UseGuards(RoleGuard)
  @NeedRoles(RoleEnum.STUDENT)
  @NeedPolicies(`${Constants.POLICIES_PREFIX}/FIND_TEST_BY_ID`)
  public async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CMSTestDTO> {
    return this.service.findById(id);
  }

  @Post(':id/check-test')
  @UseGuards(RoleGuard)
  @NeedRoles(RoleEnum.STUDENT)
  @NeedPolicies(`${Constants.POLICIES_PREFIX}/CHECK_TEST`)
  public async checkTest(
    @Param('id', ParseIntPipe) id: number,
    @Body() checkTest: CheckTestBodyDTO,
  ): Promise<CheckTestResponseDTO> {
    return {
      isCorrect: await this.service.checkTest(id, checkTest.chosenAlternative),
    };
  }
}
