import { AppConfigService as ConfigService } from '../../ConfigModule/service/app-config.service';
import { HttpService, Injectable, OnModuleInit } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { CMSCourseDTO } from '../dto/cms-course.dto';
import { CMSLessonDTO } from '../dto/cms-lesson.dto';
import { CMSTestDTO } from '../dto/cms-test.dto';
import { CMSPartDTO } from '../dto/cms-part.dto';

interface getCoursesOptions<T = CMSCourseDTO> {
  queryString: {
    [K in keyof T]?: T[K] | T[K][];
  };
}

@Injectable()
export class CmsIntegration implements OnModuleInit {
  private cmsJwt: string;
  private cmsUrl: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  onModuleInit(): void {
    this.cmsJwt = this.configService.cmsJwt;
    this.cmsUrl = this.configService.cmsUrl;
  }

  public async getCourses(
    { queryString }: getCoursesOptions = { queryString: {} },
  ): Promise<AxiosResponse<CMSCourseDTO[]>> {
    const url = `${this.cmsUrl}/cursos`;
    const headers = {
      authorization: `Bearer ${this.cmsJwt}`,
    };
    const params = {
      _limit: -1,
      ...queryString,
    };
    const config: AxiosRequestConfig = { headers, params };
    return this.httpService.get<CMSCourseDTO[]>(url, config).toPromise();
  }

  public async findCourseById(
    id: number,
  ): Promise<AxiosResponse<CMSCourseDTO>> {
    const url = `${this.cmsUrl}/cursos/${id}`;
    const headers = {
      authorization: `Bearer ${this.cmsJwt}`,
    };
    const config: AxiosRequestConfig = { headers };
    return this.httpService.get<CMSCourseDTO>(url, config).toPromise();
  }

  public async getLessonsByCourseId(
    courseId: number,
    options: { _sort?: string } = {},
  ): Promise<AxiosResponse<CMSLessonDTO[]>> {
    const url = `${this.cmsUrl}/aulas`;
    const headers = {
      authorization: `Bearer ${this.cmsJwt}`,
    };
    const params = {
      _limit: -1,
      'curso.id': courseId,
      ...options,
    };
    const config: AxiosRequestConfig = { headers, params };
    return this.httpService.get<CMSLessonDTO[]>(url, config).toPromise();
  }

  public async findLessonById(
    id: number,
  ): Promise<AxiosResponse<CMSLessonDTO>> {
    const url = `${this.cmsUrl}/aulas/${id}`;
    const headers = {
      authorization: `Bearer ${this.cmsJwt}`,
    };
    const config: AxiosRequestConfig = { headers };
    return this.httpService.get<CMSLessonDTO>(url, config).toPromise();
  }

  public async getPartsByLessonId(
    courseId: number,
    options: { _sort?: string } = {},
  ): Promise<AxiosResponse<CMSPartDTO[]>> {
    const url = `${this.cmsUrl}/partes`;
    const headers = {
      authorization: `Bearer ${this.cmsJwt}`,
    };
    const params = {
      _limit: -1,
      'aula.id': courseId,
      ...options,
    };
    const config: AxiosRequestConfig = { headers, params };
    return this.httpService.get<CMSPartDTO[]>(url, config).toPromise();
  }

  public async findPartById(id: number): Promise<AxiosResponse<CMSPartDTO>> {
    const url = `${this.cmsUrl}/partes/${id}`;
    const headers = {
      authorization: `Bearer ${this.cmsJwt}`,
    };
    const config: AxiosRequestConfig = { headers };
    return this.httpService.get<CMSPartDTO>(url, config).toPromise();
  }

  public async getTestsByPartId(
    partId: number,
    options: { _sort?: string } = {},
  ): Promise<AxiosResponse<CMSTestDTO[]>> {
    const url = `${this.cmsUrl}/exercicios`;
    const headers = {
      authorization: `Bearer ${this.cmsJwt}`,
    };
    const params = {
      _limit: -1,
      'parte.id': partId,
      ...options,
    };
    const config: AxiosRequestConfig = { headers, params };
    return this.httpService.get<CMSTestDTO[]>(url, config).toPromise();
  }

  public async findTestById(id: number): Promise<AxiosResponse<CMSTestDTO>> {
    const url = `${this.cmsUrl}/exercicios/${id}`;
    const headers = {
      authorization: `Bearer ${this.cmsJwt}`,
    };
    const config: AxiosRequestConfig = { headers };
    return this.httpService.get<CMSTestDTO>(url, config).toPromise();
  }
}
