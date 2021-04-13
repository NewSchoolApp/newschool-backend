import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Constants } from '../../../CommonsModule/constants';
import { TrailService } from '../../service/v2/trail.service';
import { CMSTrailDTO } from '../../dto/cms-trail.dto';

@ApiTags('Pilar')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_2}/${Constants.TRAIL_ENDPOINT}`,
)
export class TrailController {
  constructor(private readonly service: TrailService) {}

  public getAll(): Promise<CMSTrailDTO[]> {
    return this.service.getAll();
  }

  @Get('/:id')
  public findById(@Param('id', ParseIntPipe) id: number): Promise<CMSTrailDTO> {
    return this.service.findById(id);
  }
}
