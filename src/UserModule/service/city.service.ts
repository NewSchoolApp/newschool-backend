import { HttpService, Injectable } from '@nestjs/common';
import { CityDTO } from '../dto/city.dto';

@Injectable()
export class CityService {
  constructor(private http: HttpService) {}

  public async getCitiesByUf(uf: string): Promise<CityDTO[]> {
    const response = await this.http
      .get(`http://educacao.dadosabertosbr.com/api/cidades/${uf.toLowerCase()}`)
      .toPromise();
    const body: string[] = response.data;
    // body example: ['123412:SANTOS']

    let mappedBody: CityDTO[] = [];
    for (const city of body) {
      const [id, name] = city.split(':');
      mappedBody = [...mappedBody, { id, name }];
    }
    return mappedBody;
  }
}
