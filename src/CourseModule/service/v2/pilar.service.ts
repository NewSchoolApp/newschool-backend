import { Injectable } from '@nestjs/common';
import { CmsIntegration } from '../../integration/cms.integration';
import { CMSPilarDTO } from '../../dto/cms-pilar.dto';

@Injectable()
export class PilarService {
  constructor(private readonly cmsIntegration: CmsIntegration) {}

  public async getAll(): Promise<CMSPilarDTO[]> {
    const { data: pilars } = await this.cmsIntegration.getPilars({
      _sort: 'published_at:desc',
    });

    pilars.forEach(function (pilar){
      pilar.cursos = pilar.cursos.sort((a, b) => (a. published_at > b.published_at ? -1 : 1));
    });

    return pilars;
  }

  public async findById(id: number): Promise<CMSPilarDTO> {
    const { data: pilar } = await this.cmsIntegration.findPilarById(id);
    return pilar;
  }
}
