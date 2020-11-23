import { AppConfigService as ConfigService } from '../../ConfigModule/service/app-config.service';
import { HttpService, Injectable, OnModuleInit } from '@nestjs/common';
import { CMSLoginDTO } from '../dto/cms-login.dto';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { CMSCourseDTO } from '../dto/cms-course.dto';
import { CMSLessonDTO } from '../dto/cms-lesson.dto';
import { CMSTestDTO } from '../dto/cms-test.dto';
import { CMSPartDTO } from '../dto/cms-part.dto';

@Injectable()
export class CmsIntegration implements OnModuleInit {
  private cmsUrl: string;
  private cmsIdentifier: string;
  private cmsPassword: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  onModuleInit(): void {
    const {
      cmsUrl,
      cmsIdentifier,
      cmsPassword,
    } = this.configService.getCmsConfiguration();
    this.cmsUrl = cmsUrl;
    this.cmsIdentifier = cmsIdentifier;
    this.cmsPassword = cmsPassword;
  }

  private async login(): Promise<AxiosResponse<CMSLoginDTO>> {
    const url = `${this.cmsUrl}/auth/local`;
    const body = {
      identifier: this.cmsIdentifier,
      password: this.cmsPassword,
    };
    return this.httpService.post<CMSLoginDTO>(url, body).toPromise();
  }

  public async getCourses(): Promise<AxiosResponse<CMSCourseDTO[]>> {
    const { data }: AxiosResponse<CMSLoginDTO> = await this.login();
    const url = `${this.cmsUrl}/cursos`;
    const headers = {
      authorization: `Bearer ${data.jwt}`,
    };
    const params = {
      _limit: -1,
    };
    const config: AxiosRequestConfig = { headers, params };
    return this.httpService.get<CMSCourseDTO[]>(url, config).toPromise();
  }

  public async findCourseById(
    id: number,
  ): Promise<AxiosResponse<CMSCourseDTO>> {
    const { data }: AxiosResponse<CMSLoginDTO> = await this.login();
    const url = `${this.cmsUrl}/cursos/${id}`;
    const headers = {
      authorization: `Bearer ${data.jwt}`,
    };
    const config: AxiosRequestConfig = { headers };
    return this.httpService.get<CMSCourseDTO>(url, config).toPromise();
  }

  public async getLessonsByCourseId(
    courseId: number,
  ): Promise<AxiosResponse<CMSLessonDTO[]>> {
    const { data }: AxiosResponse<CMSLoginDTO> = await this.login();
    const url = `${this.cmsUrl}/aulas`;
    const headers = {
      authorization: `Bearer ${data.jwt}`,
    };
    const params = {
      _limit: -1,
      'curso.id': courseId,
    };
    const config: AxiosRequestConfig = { headers, params };
    return this.httpService.get<CMSLessonDTO[]>(url, config).toPromise();
  }

  public async findLessonById(
    id: number,
  ): Promise<AxiosResponse<CMSLessonDTO>> {
    const { data }: AxiosResponse<CMSLoginDTO> = await this.login();
    const url = `${this.cmsUrl}/aulas/${id}`;
    const headers = {
      authorization: `Bearer ${data.jwt}`,
    };
    const config: AxiosRequestConfig = { headers };
    return this.httpService.get<CMSLessonDTO>(url, config).toPromise();
  }

  public async getPartsByLessonId(
    courseId: number,
  ): Promise<AxiosResponse<CMSPartDTO[]>> {
    const { data }: AxiosResponse<CMSLoginDTO> = await this.login();
    const url = `${this.cmsUrl}/partes`;
    const headers = {
      authorization: `Bearer ${data.jwt}`,
    };
    const params = {
      _limit: -1,
      'aula.id': courseId,
    };
    const config: AxiosRequestConfig = { headers, params };
    return this.httpService.get<CMSPartDTO[]>(url, config).toPromise();
  }

  public async findPartById(id: number): Promise<AxiosResponse<CMSPartDTO>> {
    const { data }: AxiosResponse<CMSLoginDTO> = await this.login();
    const url = `${this.cmsUrl}/partes/${id}`;
    const headers = {
      authorization: `Bearer ${data.jwt}`,
    };
    const config: AxiosRequestConfig = { headers };
    return this.httpService.get<CMSPartDTO>(url, config).toPromise();
  }

  public async getTestsByPartId(
    partId: number,
  ): Promise<AxiosResponse<CMSTestDTO[]>> {
    const { data }: AxiosResponse<CMSLoginDTO> = await this.login();
    const url = `${this.cmsUrl}/exercicios`;
    const headers = {
      authorization: `Bearer ${data.jwt}`,
    };
    const params = {
      _limit: -1,
      'parte.id': partId,
    };
    const config: AxiosRequestConfig = { headers, params };
    return this.httpService.get<CMSTestDTO[]>(url, config).toPromise();
  }

  public async findTestById(id: number): Promise<AxiosResponse<CMSTestDTO>> {
    const { data }: AxiosResponse<CMSLoginDTO> = await this.login();
    const url = `${this.cmsUrl}/exercicios/${id}`;
    const headers = {
      authorization: `Bearer ${data.jwt}`,
    };
    const config: AxiosRequestConfig = { headers };
    return this.httpService.get<CMSTestDTO>(url, config).toPromise();
  }
}
