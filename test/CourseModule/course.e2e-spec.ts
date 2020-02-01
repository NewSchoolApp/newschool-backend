import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { Connection, EntityManager, QueryRunner, Repository } from 'typeorm';
import { ClientCredentials, Role } from '../../src/SecurityModule/entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  ClientCredentialsEnum,
  GrantTypeEnum,
  RoleEnum,
} from '../../src/SecurityModule/enum';
import { Constants } from '../../src/CommonsModule';
import { NewCourseDTO, CourseUpdateDTO } from 'src/CourseModule/dto';
import { initializeTransactionalContext } from 'typeorm-transactional-cls-hooked';

const stringToBase64 = (string: string) => {
  return Buffer.from(string).toString('base64');
};

describe('CourseController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
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

    const dbConnection = moduleFixture.get(Connection);
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

  it('should add course', async done => {
    return request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS)
      .then(res => {
        return request(app.getHttpServer())
          .post(courseUrl)
          .set('Authorization', `Bearer ${res.body.accessToken}`)
          .send({
            title: 'Teste E3E',
            thumbUrl: 'http://teste.com/thumb.png',
            authorName: 'Test',
            description: 'Este é um registro de teste',
          } as NewCourseDTO)
          .expect(201)
          .expect(res => {
            expect(res.body.id).not.toBeUndefined();
            expect(res.body.slug).toBe('teste-e3e');
          })
          .then(() => done());
      });
  });

  it('should find all courses', async done => {
    return request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS)
      .then(res => {
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
      .then(res => {
        return request(app.getHttpServer())
          .post(courseUrl)
          .set('Authorization', `Bearer ${res.body.accessToken}`)
          .send({
            title: 'Teste E3E2',
            thumbUrl: 'http://teste.com/thumb.png',
            authorName: 'Teste',
            description: 'teste 2',
          } as NewCourseDTO)
          .then(_res => {
            return request(app.getHttpServer())
              .get(`${courseUrl}/${_res.body.id}`)
              .set('Authorization', `Bearer ${res.body.accessToken}`)
              .expect(response => {
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
      .then(res => {
        return request(app.getHttpServer())
          .post(courseUrl)
          .set('Authorization', `Bearer ${res.body.accessToken}`)
          .send({
            title: 'Teste E3E3',
            thumbUrl: 'http://teste.com/thumb.png',
            authorName: 'Teste',
            description: 'teste 2',
          } as NewCourseDTO)
          .then(_res => {
            return request(app.getHttpServer())
              .get(`${courseUrl}/slug/${_res.body.slug}`)
              .set('Authorization', `Bearer ${res.body.accessToken}`)
              .expect(response => {
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
      .then(res => {
        return request(app.getHttpServer())
          .post(courseUrl)
          .set('Authorization', `Bearer ${res.body.accessToken}`)
          .send({
            title: 'Teste E3E4',
            thumbUrl: 'http://teste.com/thumb.png',
            authorName: 'Teste',
            description: 'teste 2',
          } as NewCourseDTO)
          .then(() => {
            return request(app.getHttpServer())
              .get(`${courseUrl}/slug/randomSlug`)
              .set('Authorization', `Bearer ${res.body.accessToken}`)
              .expect(404);
          });
      });
  });

  it('should return 404 if ID doesnt exist', async done => {
    return request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS)
      .then(res => {
        return request(app.getHttpServer())
          .get(`${courseUrl}/0`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${res.body.accessToken}`)
          .expect('Content-Type', /json/)
          .expect(404)
          .then(() => done());
      });
  });

  it('should delete course by id', async () => {
    return request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS)
      .then(res => {
        return request(app.getHttpServer())
          .post(courseUrl)
          .set('Authorization', `Bearer ${res.body.accessToken}`)
          .send({
            title: 'Teste E3E',
            thumbUrl: 'http://teste.com/thumb.png',
            authorName: 'Teste',
            description: 'Este é um registro de teste',
          } as NewCourseDTO)
          .then(_res => {
            return request(app.getHttpServer())
              .delete(`${courseUrl}/${_res.body.id}`)
              .set('Authorization', `Bearer ${res.body.accessToken}`)
              .expect(200);
          });
      });
  });

  it('should update course', async done => {
    return request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS)
      .then(res => {
        return request(app.getHttpServer())
          .post(courseUrl)
          .set('Authorization', `Bearer ${res.body.accessToken}`)
          .send({
            title: 'Teste E3E',
            thumbUrl: 'http://teste.com/thumb.png',
            authorName: 'Teste',
            description: 'Este é um registro de teste',
          } as NewCourseDTO)
          .then(_res => {
            return request(app.getHttpServer())
              .put(`${courseUrl}/${_res.body.id}`)
              .send({
                title: 'Test Update',
                thumbUrl: _res.body.thumbUrl,
                authorId: _res.body.authorId,
                description: _res.body.description,
              } as CourseUpdateDTO)
              .set('Authorization', `Bearer ${res.body.accessToken}`)
              .then(__res => {
                return request(app.getHttpServer())
                  .get(`${courseUrl}/${__res.body.id}`)
                  .set('Authorization', `Bearer ${res.body.accessToken}`)
                  .expect(response => {
                    expect(response.body.title).toBe('Test Update');
                  })
                  .then(() => done());
              });
          });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
