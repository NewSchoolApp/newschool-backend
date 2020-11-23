import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CmsIntegration } from '../../integration/cms.integration';
import { CMSLessonDTO } from '../../dto/cms-lesson.dto';
import { CMSTestDTO } from '../../dto/cms-test.dto';
import { ChosenAlternativeEnum } from '../../dto/check-test.dto';

@Injectable()
export class PartV2Service {
  constructor(private readonly cmsIntegration: CmsIntegration) {}

  public async getAll(lessonId: number): Promise<CMSLessonDTO[]> {
    const { data } = await this.cmsIntegration.getPartsByLessonId(lessonId);
    return data;
  }

  public async findById(id: number): Promise<CMSTestDTO> {
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

  public async checkTest(
    id: number,
    chosenAlternative: ChosenAlternativeEnum,
  ): Promise<boolean> {
    const test = await this.findById(id);
    return chosenAlternative === test.alternativa_certa.toUpperCase();
  }
}
