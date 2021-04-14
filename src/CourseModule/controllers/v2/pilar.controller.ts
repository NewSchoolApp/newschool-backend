import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Constants } from '../../../CommonsModule/constants';
import { PilarService } from '../../service/v2/pilar.service';
import { CMSPilarDTO } from '../../dto/cms-pilar.dto';
import { NeedRole } from '../../../CommonsModule/guard/role-metadata.guard';
import { RoleEnum } from '../../../SecurityModule/enum/role.enum';
import { RoleGuard } from '../../../CommonsModule/guard/role.guard';

@ApiTags('Pilar')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_2}/${Constants.PILAR_ENDPOINT}`,
)
export class PilarController {
  constructor(private readonly service: PilarService) {}

  @Get()
  @NeedRole(RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public getAll(): Promise<CMSPilarDTO[]> {
    return this.service.getAll();
  }

  @Get('/:id')
  @NeedRole(RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public findById(@Param('id', ParseIntPipe) id: number): Promise<CMSPilarDTO> {
    return this.service.findById(id);
  }
}
