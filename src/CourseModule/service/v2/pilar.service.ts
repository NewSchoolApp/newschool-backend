import { Injectable } from '@nestjs/common';
import { CmsIntegration } from '../../integration/cms.integration';
import { CMSPilarDTO } from '../../dto/cms-pilar.dto';

@Injectable()
export class PilarService {
  constructor(private readonly cmsIntegration: CmsIntegration) {}

  public async getAll(): Promise<CMSPilarDTO[]> {
    const { data: pilars } = await this.cmsIntegration.getPilars();
    return pilars;
  }

  public async findById(id: number): Promise<CMSPilarDTO> {
    const { data: pilar } = await this.cmsIntegration.findPilarById(id);
    return pilar;
  }
}
