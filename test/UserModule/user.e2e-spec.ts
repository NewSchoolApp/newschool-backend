import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { Connection, EntityManager, QueryRunner, Repository } from 'typeorm';
import { ClientCredentials, Role } from '../../src/SecurityModule/entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientCredentialsEnum, GrantTypeEnum, RoleEnum } from '../../src/SecurityModule/enum';
import { Constants } from '../../src/CommonsModule';
import { NewUserDTO, UserUpdateDTO } from '../../src/UserModule/dto';

const stringToBase64 = (string: string) => {
  return Buffer.from(string).toString('base64');
};

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let queryRunner: QueryRunner;
  let authorization: string;
  let adminRole: Role;
  const adminRoleEnum: RoleEnum = RoleEnum.ADMIN;
  const userUrl = `/${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.USER_ENDPOINT}`;

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
    adminRole = savedRole;

    const clientCredentialRepository: Repository<ClientCredentials> = moduleFixture.get<Repository<ClientCredentials>>(getRepositoryToken(ClientCredentials));
    const clientCredentials: ClientCredentials = new ClientCredentials();
    clientCredentials.name = ClientCredentialsEnum['NEWSCHOOL@FRONT'];
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

  it('should add user', async (done) => {
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
            role: adminRoleEnum,
          } as NewUserDTO)
          .expect(201)
          .then(() => done());
      });
  });

  it('should throw if user is missing a required property', async (done) => {
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
            role: adminRoleEnum,
          } as NewUserDTO)
          .expect(400)
          .then(() => done());
      });
  });

  it('should find user by id', async (done) => {
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
            role: adminRoleEnum,
          } as NewUserDTO)
          .then((_res) => {
            return request(app.getHttpServer())
              .get(`${userUrl}/${_res.body.id}`)
              .set('Authorization', `Bearer ${res.body.accessToken}`)
              .expect((response) => {
                expect(response.body.email).toBe('my-user2@email.com');
              })
              .expect(200)
              .then(() => done());
          });
      });
  });

  it('should update user', async (done) => {
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
            role: adminRoleEnum,
          } as NewUserDTO)
          .then((_res) => {
            const updateBody: UserUpdateDTO = {
              id: _res.body.id,
              email: _res.body.email,
              role: adminRoleEnum,
              name: 'updated name',
              urlFacebook: _res.body.urlFacebook,
              urlInstagram: _res.body.urlInstagram,
            };
            return request(app.getHttpServer())
              .put(`${userUrl}/${_res.body.id}`)
              .type('form')
              .set('Authorization', `Bearer ${res.body.accessToken}`)
              .send(updateBody)
              .then((__res) => {
                return request(app.getHttpServer())
                  .get(`${userUrl}/${__res.body.id}`)
                  .set('Authorization', `Bearer ${res.body.accessToken}`)
                  .expect((response) => {
                    expect(response.body.name).toBe('updated name');
                  })
                  .then(() => done());
              });
          });
      });
  });

  it('should delete user', async (done) => {
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
            role: adminRoleEnum,
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
              })
              .then(() => done());
          });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
