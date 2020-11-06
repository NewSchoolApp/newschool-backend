import { HttpService, Injectable } from '@nestjs/common';
import { School, Schools } from '../dto/school.dto';

@Injectable()
export class SchoolService {
  constructor(private http: HttpService) {}

  public async getUserSchool(name: string, cityId: string): Promise<School[]> {
    const response = await this.http
      .get<Schools>(
        `http://educacao.dadosabertosbr.com/api/escolas/buscaavancada?nome=${name}&cidade=${cityId}`,
      )
      .toPromise();
    const [id, schoolsArray] = response.data;
    return schoolsArray;
  }
}
