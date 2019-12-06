import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { Connection, EntityManager, QueryRunner, Repository } from 'typeorm';
import { ClientCredentials } from '../../src/SecurityModule/entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientCredentialsEnum, GrantTypeEnum, RoleEnum } from '../../src/SecurityModule/enum';
import { Constants } from '../../src/CommonsModule';

const stringToBase64 = (string: string) => {
  return Buffer.from(string).toString('base64');
};

describe('CourseController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let queryRunner: QueryRunner;
  let authorization: string;
  const courseUrl: string = `/${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.COURSE_ENDPOINT}`;

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

    const clientCredentialRepository: Repository<ClientCredentials> = moduleFixture.get<Repository<ClientCredentials>>(getRepositoryToken(ClientCredentials));
    const clientCredentials: ClientCredentials = new ClientCredentials();
    clientCredentials.name = ClientCredentialsEnum.FRONT;
    clientCredentials.secret = 'test2';
    clientCredentials.role = RoleEnum.ADMIN;
    await clientCredentialRepository.save(clientCredentials);
    authorization = stringToBase64(`${clientCredentials.name}:${clientCredentials.secret}`);
  });

  beforeEach(async () => {
    await queryRunner.startTransaction();
  });

  afterEach(async () => {
    await queryRunner.rollbackTransaction();
  });

  it('should find course by id', async () => {
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
          .expect(200);
      });
  });


  it('should find course by id', async () => {
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



  afterAll(async () => {
    await app.close();
  });
});
