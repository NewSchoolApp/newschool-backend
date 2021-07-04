import { Injectable } from '@nestjs/common';
import { CmsIntegration } from '../../integration/cms.integration';
import { CMSHighlightDTO } from '../../dto/cms-highlight.dto';

@Injectable()
export class HighlightService {
  constructor(private readonly cmsIntegration: CmsIntegration) {}

  public async getAll(): Promise<CMSHighlightDTO[]> {
    const { data: pilars } = await this.cmsIntegration.getHighlights();
    return pilars;
  }

  public async findById(id: number): Promise<CMSHighlightDTO> {
    const { data: pilar } = await this.cmsIntegration.findHighlightById(id);
    return pilar;
  }
}
