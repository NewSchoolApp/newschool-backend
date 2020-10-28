import * as request from 'supertest';
import * as path from 'path';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { Connection, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional-cls-hooked';
import { Role } from '../../src/SecurityModule/entity/role.entity';
import { RoleEnum } from '../../src/SecurityModule/enum/role.enum';
import { ClientCredentials } from '../../src/SecurityModule/entity/client-credentials.entity';
import { ClientCredentialsEnum } from '../../src/SecurityModule/enum/client-credentials.enum';
import { GrantTypeEnum } from '../../src/SecurityModule/enum/grant-type.enum';
import { NewCourseDTO } from '../../src/CourseModule/dto/new-course.dto';
import { Constants } from '../../src/CommonsModule/constants';
import { Course } from '../../src/CourseModule/entity/course.entity';
import { GenderEnum } from '../../src/UserModule/enum/gender.enum';
import { EscolarityEnum } from '../../src/UserModule/enum/escolarity.enum';
import { NewStudentDTO } from '../../src/UserModule/dto/new-student.dto';
import { CourseDTO } from '../../src/CourseModule/dto/course.dto';

const stringToBase64 = (string: string) => {
  return Buffer.from(string).toString('base64');
};

const fileToUpload = path.resolve(
  path.join(__dirname, '..', '..', 'README.md'),
);

describe('CourseController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let dbConnection: Connection;
  let authorization: string;
  const courseUrl = `/${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.COURSE_ENDPOINT}`;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    initializeTransactionalContext();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dbConnection = moduleFixture.get(Connection);

    const roleRepository: Repository<Role> = moduleFixture.get<
      Repository<Role>
    >(getRepositoryToken(Role));
    const role: Role = new Role();
    role.name = RoleEnum.ADMIN;
    const savedRole = await roleRepository.save(role);

    const clientCredentialRepository: Repository<ClientCredentials> = moduleFixture.get<
      Repository<ClientCredentials>
    >(getRepositoryToken(ClientCredentials));
    const clientCredentials: ClientCredentials = new ClientCredentials();
    clientCredentials.name = ClientCredentialsEnum['NEWSCHOOL@FRONT'];
    clientCredentials.secret = 'test2';
    clientCredentials.role = savedRole;
    clientCredentials.authorizedGrantTypes = [GrantTypeEnum.CLIENT_CREDENTIALS];
    clientCredentials.accessTokenValidity = 3600;
    clientCredentials.refreshTokenValidity = 3600;
    await clientCredentialRepository.save(clientCredentials);
    authorization = stringToBase64(
      `${clientCredentials.name}:${clientCredentials.secret}`,
    );
  });

  it('should add course', async (done) => {
    return request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS)
      .then((res) => {
        const newCourse = {
          title: 'Teste E3E to add',
          thumbUrl: 'http://teste.com/thumb.png',
          authorName: 'Test',
          authorDescription: 'Test description',
          description: 'Este é um registro de teste',
          workload: 1,
        } as NewCourseDTO;
        return request(app.getHttpServer())
          .post(courseUrl)
          .set('Authorization', `Bearer ${res.body.accessToken}`)
          .field('title', newCourse.title)
          .field('thumbUrl', newCourse.thumbUrl)
          .field('authorName', newCourse.authorName)
          .field('authorDescription', newCourse.authorDescription)
          .field('description', newCourse.description)
          .field('workload', newCourse.workload)
          .attach('photo', fileToUpload)
          .expect((res) => {
            console.log(res.body);
            expect(res.body.id).not.toBeUndefined();
            expect(res.body.slug).toBe('teste-e3e-to-add');
          })
          .then(() => done());
      });
  });

  it('should find all courses', async (done) => {
    return request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS)
      .then((res) => {
        return request(app.getHttpServer())
          .get(`${courseUrl}/`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${res.body.accessToken}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .then(() => done());
      });
  });

  it('should find course by id', async () => {
    return request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS)
      .then((res) => {
        const newCourse = {
          title: 'Teste E3E2',
          thumbUrl: 'http://teste.com/thumb.png',
          authorName: 'Teste',
          authorDescription: 'Test description',
          description: 'teste 2',
          workload: 1,
        } as NewCourseDTO;
        return request(app.getHttpServer())
          .post(courseUrl)
          .set('Authorization', `Bearer ${res.body.accessToken}`)
          .field('title', newCourse.title)
          .field('thumbUrl', newCourse.thumbUrl)
          .field('authorName', newCourse.authorName)
          .field('authorDescription', newCourse.authorDescription)
          .field('description', newCourse.description)
          .field('workload', newCourse.workload)
          .attach('photo', fileToUpload)
          .then((_res) => {
            return request(app.getHttpServer())
              .get(`${courseUrl}/${_res.body.id}`)
              .set('Authorization', `Bearer ${res.body.accessToken}`)
              .expect((response) => {
                expect(response.body.description).toBe(_res.body.description);
              })
              .expect(200);
          });
      });
  });

  it('should find course by slug', async () => {
    return request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS)
      .then((res) => {
        const newCourse = {
          title: 'Teste E3E3',
          thumbUrl: 'http://teste.com/thumb.png',
          authorName: 'Teste',
          authorDescription: 'Test description',
          description: 'teste 2',
          workload: 1,
        } as NewCourseDTO;
        return request(app.getHttpServer())
          .post(courseUrl)
          .set('Authorization', `Bearer ${res.body.accessToken}`)
          .field('title', newCourse.title)
          .field('thumbUrl', newCourse.thumbUrl)
          .field('authorName', newCourse.authorName)
          .field('authorDescription', newCourse.authorDescription)
          .field('description', newCourse.description)
          .field('workload', newCourse.workload)
          .attach('photo', fileToUpload)
          .then((_res) => {
            return request(app.getHttpServer())
              .get(`${courseUrl}/slug/${_res.body.slug}`)
              .set('Authorization', `Bearer ${res.body.accessToken}`)
              .expect((response) => {
                expect(response.body.slug).toBe(_res.body.slug);
              })
              .expect(200);
          });
      });
  });

  it('should return 404 if slug doesnt exist', async () => {
    return request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS)
      .then((res) => {
        return request(app.getHttpServer())
          .get(`${courseUrl}/slug/randomSlug`)
          .set('Authorization', `Bearer ${res.body.accessToken}`)
          .expect(404);
      });
  });

  it('should return 404 if ID doesnt exist', async () => {
    return request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS)
      .then((res) => {
        return request(app.getHttpServer())
          .get(`${courseUrl}/0`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${res.body.accessToken}`)
          .expect('Content-Type', /json/)
          .expect(404);
      });
  });

  it('should delete course by id', async () => {
    return request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS)
      .then((res) => {
        const newCourse = {
          title: 'Teste E3E to delete',
          thumbUrl: 'http://teste.com/thumb.png',
          authorName: 'Teste',
          authorDescription: 'Teste',
          description: 'Este é um registro de teste',
          workload: 1,
        } as NewCourseDTO;
        return request(app.getHttpServer())
          .post(courseUrl)
          .set('Authorization', `Bearer ${res.body.accessToken}`)
          .field('title', newCourse.title)
          .field('thumbUrl', newCourse.thumbUrl)
          .field('authorName', newCourse.authorName)
          .field('authorDescription', newCourse.authorDescription)
          .field('description', newCourse.description)
          .field('workload', newCourse.workload)
          .attach('photo', fileToUpload)
          .then((_res) => {
            return request(app.getHttpServer())
              .delete(`${courseUrl}/${_res.body.id}`)
              .set('Authorization', `Bearer ${res.body.accessToken}`)
              .expect(200);
          });
      });
  });

  it('should update course', async (done) => {
    return request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS)
      .then((res) => {
        const newCourse = {
          title: 'Teste E3E to update',
          thumbUrl: 'http://teste.com/thumb.png',
          authorName: 'Teste',
          authorDescription: 'Teste',
          description: 'Este é um registro de teste',
          workload: 1,
        } as NewCourseDTO;
        return request(app.getHttpServer())
          .post(courseUrl)
          .set('Authorization', `Bearer ${res.body.accessToken}`)
          .field('title', newCourse.title)
          .field('thumbUrl', newCourse.thumbUrl)
          .field('authorName', newCourse.authorName)
          .field('authorDescription', newCourse.authorDescription)
          .field('description', newCourse.description)
          .field('workload', newCourse.workload)
          .attach('photo', fileToUpload)
          .then((_res) => {
            return request(app.getHttpServer())
              .put(`${courseUrl}/${_res.body.id}`)
              .set('Authorization', `Bearer ${res.body.accessToken}`)
              .send({
                title: 'Test Update',
                thumbUrl: _res.body.thumbUrl,
                authorName: _res.body.authorName,
                authorDescription: _res.body.authorDescription,
                description: _res.body.description,
                workload: _res.body.workload,
              } as NewCourseDTO)
              .then((__res) => {
                return request(app.getHttpServer())
                  .get(`${courseUrl}/${__res.body.id}`)
                  .set('Authorization', `Bearer ${res.body.accessToken}`)
                  .expect((response) => {
                    expect(response.body.title).toBe('Test Update');
                    expect(response.body.slug).toBe('test-update');
                  })
                  .then(() => done());
              });
          });
      });
  });

  it('should display all courses', async () => {
    const courseRepository: Repository<Course> = moduleFixture.get<
      Repository<Course>
    >(getRepositoryToken(Course));

    const allCoursesQuantity: number = await courseRepository.count();

    const tokenRequest = await request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS);

    const allCoursesRequest = await request(app.getHttpServer())
      .get(`${courseUrl}`)
      .set('Authorization', `Bearer ${tokenRequest.body.accessToken}`);

    expect(allCoursesRequest.body.length).toEqual(allCoursesQuantity);
  });

  it('should display all enabled courses', async () => {
    const courseRepository: Repository<Course> = moduleFixture.get<
      Repository<Course>
    >(getRepositoryToken(Course));

    const allEnabledCoursesQuantity: number = await courseRepository.count({
      enabled: true,
    });

    const tokenRequest = await request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS);

    const allEnabledCoursesRequest = await request(app.getHttpServer())
      .get(`${courseUrl}?enabled=true`)
      .set('Authorization', `Bearer ${tokenRequest.body.accessToken}`);
    expect(allEnabledCoursesRequest.body.length).toEqual(
      allEnabledCoursesQuantity,
    );
    allEnabledCoursesRequest.body.forEach((enabledCourse: CourseDTO) => {
      expect(enabledCourse.enabled).toEqual(true);
    });
  });

  it('should display all disabled courses', async () => {
    const courseRepository: Repository<Course> = moduleFixture.get<
      Repository<Course>
    >(getRepositoryToken(Course));

    const allDisabledCoursesQuantity: number = await courseRepository.count({
      enabled: false,
    });

    const tokenRequest = await request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS);

    const allDisabledCoursesRequest = await request(app.getHttpServer())
      .get(`${courseUrl}?enabled=false`)
      .set('Authorization', `Bearer ${tokenRequest.body.accessToken}`);
    expect(allDisabledCoursesRequest.body.length).toEqual(
      allDisabledCoursesQuantity,
    );
    allDisabledCoursesRequest.body.forEach((disabledCourse: CourseDTO) => {
      expect(disabledCourse.enabled).toEqual(false);
    });
  });

  afterAll(async () => {
    await dbConnection.synchronize(true);
    await app.close();
  });
});
