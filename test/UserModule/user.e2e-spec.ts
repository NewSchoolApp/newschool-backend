import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { Connection, EntityManager, QueryRunner, Repository } from 'typeorm';
import { ClientCredentials } from '../../src/SecurityModule/entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientCredentialsEnum, GrantTypeEnum, RoleEnum } from '../../src/SecurityModule/enum';
import { Constants } from '../../src/CommonsModule';
import { NewUserDTO } from '../../src/UserModule/dto';

const stringToBase64 = (string: string) => {
  return Buffer.from(string).toString('base64');
};

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let queryRunner: QueryRunner;
  let authorization: string;
  const userUrl: string = `/${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.USER_ENDPOINT}`;

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

  it('should add user', async () => {
    return request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS)
      .then((res) => {
        return request(app.getHttpServer())
          .post(userUrl)
          .set('Authorization', `Bearer ${res.body.accessToken}`)
          .send({
            email: 'my-user1@email.com',
            password: 'mypass',
            urlInstagram: 'instagram',
            urlFacebook: 'facebook',
            name: 'name',
            role: RoleEnum.ADMIN,
          } as NewUserDTO)
          .expect(201);
      });
  });

  it('should throw if user is missing a required property', async () => {
    return request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS)
      .then((res) => {
        return request(app.getHttpServer())
          .post(userUrl)
          .set('Authorization', `Bearer ${res.body.accessToken}`)
          .send({
            password: 'mypass',
            urlInstagram: 'instagram',
            urlFacebook: 'facebook',
            name: 'name',
            role: RoleEnum.ADMIN,
          } as NewUserDTO)
          .expect(400);
      });
  });

  it('should find user by id', async () => {
    return request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS)
      .then((res) => {
        return request(app.getHttpServer())
          .post(userUrl)
          .set('Authorization', `Bearer ${res.body.accessToken}`)
          .send({
            email: 'my-user2@email.com',
            password: 'mypass',
            urlInstagram: 'instagram',
            urlFacebook: 'facebook',
            name: 'name',
            role: RoleEnum.ADMIN,
          } as NewUserDTO)
          .then((_res) => {
            return request(app.getHttpServer())
              .get(`${userUrl}/${_res.body.id}`)
              .set('Authorization', `Bearer ${res.body.accessToken}`)
              .expect((response) => {
                expect(response.body.email).toBe('my-user2@email.com');
              });
          });
      });
  });

  it('should update user', async () => {
    return request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS)
      .then((res) => {
        return request(app.getHttpServer())
          .post(userUrl)
          .set('Authorization', `Bearer ${res.body.accessToken}`)
          .send({
            email: 'my-user3@email.com',
            password: 'mypass',
            urlInstagram: 'instagram',
            urlFacebook: 'facebook',
            name: 'name',
            role: RoleEnum.ADMIN,
          } as NewUserDTO)
          .then((_res) => {
            return request(app.getHttpServer())
              .put(`${userUrl}/${_res.body.id}`)
              .set('Authorization', `Bearer ${res.body.accessToken}`)
              .send({
                ..._res.body,
                name: 'updated name',
              } as NewUserDTO)
              .then((__res) => {
                return request(app.getHttpServer())
                  .get(`${userUrl}/${__res.body.id}`)
                  .set('Authorization', `Bearer ${res.body.accessToken}`)
                  .expect((response) => {
                    expect(response.body.name).toBe('updated name');
                  });
              });
          });
      });
  });

  it('should delete user', async () => {
    return request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS)
      .then((res) => {
        return request(app.getHttpServer())
          .post(userUrl)
          .set('Authorization', `Bearer ${res.body.accessToken}`)
          .send({
            email: 'my-user4@email.com',
            password: 'mypass',
            urlInstagram: 'instagram',
            urlFacebook: 'facebook',
            name: 'name',
            role: RoleEnum.ADMIN,
          } as NewUserDTO)
          .then((_res) => {
            return request(app.getHttpServer())
              .delete(`${userUrl}/${_res.body.id}`)
              .set('Authorization', `Bearer ${res.body.accessToken}`)
              .then((__res) => {
                return request(app.getHttpServer())
                  .get(`${userUrl}/${__res.body.id}`)
                  .set('Authorization', `Bearer ${res.body.accessToken}`)
                  .expect(404);
              });
          });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
