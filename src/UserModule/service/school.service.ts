import { Injectable, HttpService } from '@nestjs/common';
import { Schools } from '../dto/school.dto';

@Injectable()
export class SchoolService {
  constructor(private http: HttpService) {}

  public async getUserSchool(name: string): Promise<Schools> {
    const response = await this.http
      .get(`http://educacao.dadosabertosbr.com/api/escolas?nome=${name}`)
      .toPromise();
    return response.data;
  }
}
