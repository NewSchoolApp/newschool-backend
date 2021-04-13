import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Constants } from '../../../CommonsModule/constants';
import { PilarService } from '../../service/v2/pilar.service';
import { CMSPilarDTO } from '../../dto/cms-pilar.dto';

@ApiTags('Pilar')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_2}/${Constants.PILAR_ENDPOINT}`,
)
export class PilarController {
  constructor(private readonly service: PilarService) {}

  public getAll(): Promise<CMSPilarDTO[]> {
    return this.service.getAll();
  }

  @Get('/:id')
  public findById(@Param('id', ParseIntPipe) id: number): Promise<CMSPilarDTO> {
    return this.service.findById(id);
  }
}
