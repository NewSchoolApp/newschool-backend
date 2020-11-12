import { HttpService, Injectable } from '@nestjs/common';
import { School, Schools } from '../dto/school.dto';
import { query } from 'express';

@Injectable()
export class SchoolService {
  constructor(private http: HttpService) {}

  public async getUserSchool(name: string, cityId: string): Promise<School[]> {
    let query;
    if (name && cityId) {
      query = `?nome=${name}&cidade=${cityId}`;
    } else if (name && !cityId) {
      query = `?nome=${name}`;
    } else {
      query = `?cidade=${cityId}`;
    }
    const response = await this.http
      .get<Schools>(
        `http://educacao.dadosabertosbr.com/api/escolas/buscaavancada${query}`,
      )
      .toPromise();
    console.log(response);
    const [id, schoolsArray] = response.data;
    return schoolsArray;
  }
}
