import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CmsIntegration } from '../../integration/cms.integration';
import { CMSLessonDTO } from '../../dto/cms-lesson.dto';
import { CMSTestDTO } from '../../dto/cms-test.dto';
import { ChosenAlternativeEnum } from '../../dto/check-test.dto';
import { CMSPartDTO } from '../../dto/cms-part.dto';

@Injectable()
export class TestV2Service {
  constructor(private readonly cmsIntegration: CmsIntegration) {}

  public async getAll(partId: number): Promise<CMSTestDTO[]> {
    const { data } = await this.cmsIntegration.getTestsByPartId(partId);
    return data;
  }

  public async findById(id: number): Promise<CMSTestDTO> {
    const errors = {
      404: () => {
        throw new NotFoundException('Course not found');
      },
    };

    try {
      const { data } = await this.cmsIntegration.findTestById(id);
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
    const test: CMSTestDTO = await this.findById(id);
    return chosenAlternative === test.alternativa_certa.toUpperCase();
  }
}
