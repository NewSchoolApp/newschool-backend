import * as request from 'supertest';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { Connection, EntityManager, QueryRunner, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional-cls-hooked';
import { Role } from '../../src/SecurityModule/entity/role.entity';
import { RoleEnum } from '../../src/SecurityModule/enum/role.enum';
import { ClientCredentials } from '../../src/SecurityModule/entity/client-credentials.entity';
import { ClientCredentialsEnum } from '../../src/SecurityModule/enum/client-credentials.enum';
import { GrantTypeEnum } from '../../src/SecurityModule/enum/grant-type.enum';
import { NewCourseDTO } from '../../src/CourseModule/dto/new-course.dto';
import { Course } from '../../src/CourseModule/entity/course.entity';
import { Constants } from '../../src/CommonsModule/constants';

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
  let queryRunner: QueryRunner;
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
    const manager = moduleFixture.get(EntityManager);

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    queryRunner = manager.queryRunner = dbConnection.createQueryRunner(
      'master',
    );

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
          .expect(201)
          .expect((res) => {
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

  afterAll(async () => {
    await dbConnection.synchronize(true);
    await app.close();
  });
});
