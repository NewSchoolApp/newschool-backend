import { Injectable } from '@nestjs/common';
import { CmsIntegration } from '../../integration/cms.integration';
import { CMSHighlightDTO } from '../../dto/cms-highlight.dto';

@Injectable()
export class HighlightService {
  constructor(private readonly cmsIntegration: CmsIntegration) {}

  public async getAll(): Promise<CMSHighlightDTO[]> {
    const { data: highlights } = await this.cmsIntegration.getHighlights({
      _sort: 'published_at:desc',
    });

    highlights.forEach(function (highlight){
      highlight.cursos = highlight.cursos.sort((a, b) => (a. published_at > b.published_at ? -1 : 1));
    });

    return highlights;
  }

  public async findById(id: number): Promise<CMSHighlightDTO> {
    const { data: pilar } = await this.cmsIntegration.findHighlightById(id);
    return pilar;
  }
}
