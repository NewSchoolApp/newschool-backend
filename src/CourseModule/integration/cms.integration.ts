import { Aula, Capa, CMSCourseDTO, Formats, Pilar } from './../dto/cms-course.dto';
import { plainToClass } from 'class-transformer';
import { json } from 'express';
import { AppConfigService as ConfigService } from '../../ConfigModule/service/app-config.service';
import { HttpService, Injectable, OnModuleInit } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { CMSLessonDTO } from '../dto/cms-lesson.dto';
import { CMSTestDTO } from '../dto/cms-test.dto';
import { CMSPartDTO } from '../dto/cms-part.dto';
import { CMSPilarDTO } from '../dto/cms-pilar.dto';
import { CMSTrailOrderDTO } from '../dto/cms-trail-order.dto';
import { CMSTrailDTO } from '../dto/cms-trail.dto';
import { CMSHighlightDTO } from '../dto/cms-highlight.dto';
import * as courses from '../data/courses.json';

interface getCoursesOptions<T = CMSCourseDTO> {
  queryString: {
    [K in keyof T]?: T[K] | T[K][];
  };
}

interface getTrailOrdersOptions<T> {
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

    //return courses;
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

  public async getPilars(): Promise<AxiosResponse<CMSPilarDTO[]>> {
    const url = `${this.cmsUrl}/pilars`;
    const headers = {
      authorization: `Bearer ${this.cmsJwt}`,
    };
    const config: AxiosRequestConfig = { headers };
    return this.httpService.get<CMSPilarDTO[]>(url, config).toPromise();
  }

  public async findPilarById(id: number): Promise<AxiosResponse<CMSPilarDTO>> {
    const url = `${this.cmsUrl}/pilars/${id}`;
    const headers = {
      authorization: `Bearer ${this.cmsJwt}`,
    };
    const config: AxiosRequestConfig = { headers };
    return this.httpService.get<CMSPilarDTO>(url, config).toPromise();
  }

  public async getTrails(): Promise<AxiosResponse<CMSTrailDTO[]>> {
    const url = `${this.cmsUrl}/trilhas`;
    const headers = {
      authorization: `Bearer ${this.cmsJwt}`,
    };
    const config: AxiosRequestConfig = { headers };
    return this.httpService.get<CMSTrailDTO[]>(url, config).toPromise();
  }

  public async findTrailById(id: number): Promise<AxiosResponse<CMSTrailDTO>> {
    const url = `${this.cmsUrl}/trilhas/${id}`;
    const headers = {
      authorization: `Bearer ${this.cmsJwt}`,
    };
    const config: AxiosRequestConfig = { headers };
    return this.httpService.get<CMSTrailDTO>(url, config).toPromise();
  }


  public async getHighlights(): Promise<AxiosResponse<CMSHighlightDTO[]>> {
    const url = `${this.cmsUrl}/destaques`;
    const headers = {
      authorization: `Bearer ${this.cmsJwt}`,
    };
    const config: AxiosRequestConfig = { headers };
    return this.httpService.get<CMSHighlightDTO[]>(url, config).toPromise();
  }

  public async findHighlightById(id: number): Promise<AxiosResponse<CMSHighlightDTO>> {
    const url = `${this.cmsUrl}/destaques/${id}`;
    const headers = {
      authorization: `Bearer ${this.cmsJwt}`,
    };
    const config: AxiosRequestConfig = { headers };
    return this.httpService.get<CMSHighlightDTO>(url, config).toPromise();
  }


  public async getTrailOrders(
    { queryString }: getCoursesOptions = { queryString: {} },
  ): Promise<AxiosResponse<CMSTrailOrderDTO[]>> {
    const url = `${this.cmsUrl}/ordenacao-da-trilhas`;
    const headers = {
      authorization: `Bearer ${this.cmsJwt}`,
    };
    const params = {
      _limit: -1,
      ...queryString,
    };
    const config: AxiosRequestConfig = { headers, params };
    return this.httpService.get<CMSTrailOrderDTO[]>(url, config).toPromise();
  }

  public async findTrailOrderById(
    id: number,
  ): Promise<AxiosResponse<CMSTrailOrderDTO>> {
    const url = `${this.cmsUrl}/ordenacao-da-trilhas/${id}`;
    const headers = {
      authorization: `Bearer ${this.cmsJwt}`,
    };
    const config: AxiosRequestConfig = { headers };
    return this.httpService.get<CMSTrailOrderDTO>(url, config).toPromise();
  }
}
