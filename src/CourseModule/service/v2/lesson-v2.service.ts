import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CmsIntegration } from '../../integration/cms.integration';
import { CMSLessonDTO } from '../../dto/cms-lesson.dto';

@Injectable()
export class LessonV2Service {
  constructor(private readonly cmsIntegration: CmsIntegration) {}

  public async getAll(courseId: number): Promise<CMSLessonDTO[]> {
    const { data } = await this.cmsIntegration.getLessonsByCourseId(courseId);
    return data;
  }

  public async findById(id: number): Promise<CMSLessonDTO> {
    const errors = {
      404: () => {
        throw new NotFoundException('Course not found');
      },
    };

    try {
      const { data } = await this.cmsIntegration.findLessonById(id);
      return data;
    } catch (e) {
      const error = errors[e.response.status];
      if (!error) throw new InternalServerErrorException();
      error();
    }
  }
}
