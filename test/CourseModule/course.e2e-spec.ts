import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { Connection, EntityManager, QueryRunner, Repository } from 'typeorm';
import { ClientCredentials, Role } from '../../src/SecurityModule/entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientCredentialsEnum, GrantTypeEnum, RoleEnum } from '../../src/SecurityModule/enum';
import { Constants } from '../../src/CommonsModule';
import { Course } from '../../src/CourseModule';

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

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    const dbConnection = moduleFixture.get(Connection);
    const manager = moduleFixture.get(EntityManager);

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    queryRunner = manager.queryRunner = dbConnection.createQueryRunner('master');

    const roleRepository: Repository<Role> = moduleFixture.get<Repository<Role>>(getRepositoryToken(Role));
    const role: Role = new Role();
    role.name = RoleEnum.ADMIN;
    const savedRole = await roleRepository.save(role);

    const clientCredentialRepository: Repository<ClientCredentials> = moduleFixture.get<Repository<ClientCredentials>>(getRepositoryToken(ClientCredentials));
    const clientCredentials: ClientCredentials = new ClientCredentials();
    clientCredentials.name = ClientCredentialsEnum.FRONT;
    clientCredentials.secret = 'test2';
    clientCredentials.role = savedRole;
    await clientCredentialRepository.save(clientCredentials);
    authorization = stringToBase64(`${clientCredentials.name}:${clientCredentials.secret}`);
  });

  beforeEach(async () => {
    await queryRunner.startTransaction();
  });

  afterEach(async () => {
    await queryRunner.rollbackTransaction();
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
    const courseRepository: Repository<Course> = moduleFixture.get<Repository<Course>>(getRepositoryToken(Course));
    const course: Course = new Course();
    course.title = 'teste';
    course.description = 'Teste';
    course.thumbUrl = '';
    course.authorId = '1';
    // const courseRepository: Repository<Course> = moduleFixture.get<Repository<Course>>(getRepositoryToken(ClientCredentials));
    // const course: Course = new Course();
    // course.description = 'Teste';
    // course.thumbUrl = '';
    // course.authorId = '1';
    // course.title = 'teste';
    const savedCourse = await courseRepository.save(course);

    return request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS)
      .then(async (res) => {
        return request(app.getHttpServer())
          .get(`${courseUrl}/${savedCourse.id}`)
          .set('Authorization', `Bearer ${res.body.accessToken}`)
          .expect((response) => {
            expect(response.body.description).toBe(savedCourse.description);
          });
      });
  });

  it('should return 404 if ID doesnt exist', async (done) => {
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
          .expect(404)
          .then(() => done());
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
