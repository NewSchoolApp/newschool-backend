import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { CmsIntegration } from '../../integration/cms.integration';
import { CMSTrailDTO } from '../../dto/cms-trail.dto';

@Injectable()
export class CmsService {
  constructor(private readonly integration: CmsIntegration) {}
}
