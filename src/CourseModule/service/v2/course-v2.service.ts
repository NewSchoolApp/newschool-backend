import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CmsIntegration } from '../../integration/cms.integration';
import { CMSCourseDTO } from '../../dto/cms-course.dto';
import { CourseTaken } from '../../entity/course.taken.entity';

@Injectable()
export class CourseV2Service {
  constructor(private readonly cmsIntegration: CmsIntegration) {}

  public async getAll(): Promise<CMSCourseDTO[]> {
    const { data } = await this.cmsIntegration.getCourses();
    return data;
  }

  public async findById(id: string): Promise<CMSCourseDTO> {
    const errors = {
      404: () => {
        throw new NotFoundException('Course not found');
      },
    };

    try {
      const { data } = await this.cmsIntegration.findCourseById(id);
      return data;
    } catch (e) {
      const error = errors[e.response.status];
      if (!error) throw new InternalServerErrorException();
      error();
    }
  }
}
