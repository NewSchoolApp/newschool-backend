import { Injectable } from '@nestjs/common';
import { CmsService } from './cms.service';
import { CmsIntegration } from '../../integration/cms.integration';
import { CMSTrailDTO } from '../../dto/cms-trail.dto';

@Injectable()
export class TrailService {
  constructor(
    private readonly cmsService: CmsService,
    private readonly cmsIntegration: CmsIntegration,
  ) {}

  public async getAll(): Promise<CMSTrailDTO[]> {
    const { data: trails } = await this.cmsIntegration.getTrails({
      _sort: 'published_at:desc',
    });

    trails.forEach(function (trail){
      trail.cursos = trail.cursos.sort((a, b) => (a. published_at > b.published_at ? -1 : 1));
    });

    return trails;
  }

  public async findById(id: number): Promise<CMSTrailDTO> {
    const { data: pilar } = await this.cmsIntegration.findTrailById(id);
    return pilar;
  }
}

