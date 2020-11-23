import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CmsIntegration } from '../../integration/cms.integration';
import { CMSPartDTO } from '../../dto/cms-part.dto';

@Injectable()
export class PartV2Service {
  constructor(private readonly cmsIntegration: CmsIntegration) {}

  public async getAll(lessonId: string): Promise<CMSPartDTO[]> {
    const { data } = await this.cmsIntegration.getPartsByLessonId(lessonId);
    return data;
  }

  public async findById(id: string): Promise<CMSPartDTO> {
    const errors = {
      404: () => {
        throw new NotFoundException('Course not found');
      },
    };

    try {
      const { data } = await this.cmsIntegration.findPartById(id);
      return data;
    } catch (e) {
      const error = errors[e.response.status];
      if (!error) throw new InternalServerErrorException();
      error();
    }
  }
}
