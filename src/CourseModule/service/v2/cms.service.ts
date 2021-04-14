import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { CmsIntegration } from '../../integration/cms.integration';
import { CMSTrailDTO } from '../../dto/cms-trail.dto';

@Injectable()
export class CmsService {
  constructor(private readonly integration: CmsIntegration) {}

  public async findTrailById(id: number): Promise<CMSTrailDTO> {
    const { data: trail } = await this.integration.findTrailById(id);
    const trailOrdersIds: number[] = trail.ordenacao_da_trilhas.map(
      ({ id }) => id,
    );
    const {
      data: trailOrders,
    }: AxiosResponse = await this.integration.getTrailOrders({
      queryString: { id: trailOrdersIds },
    });
    return {
      ...trail,
      ordenacao_da_trilhas: trail.ordenacao_da_trilhas.map((trailOrder) => {
        return trailOrders.find(({ id }) => id === trailOrder.id);
      }),
    };
  }
}
