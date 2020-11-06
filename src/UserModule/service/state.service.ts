import { HttpService, Injectable } from '@nestjs/common';
import { StateDTO } from '../dto/state.dto';

@Injectable()
export class StateService {
  constructor(private http: HttpService) {}

  public async getStates(): Promise<StateDTO[]> {
    const response = await this.http
      .get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados`)
      .toPromise();
    return response.data;
  }
}
