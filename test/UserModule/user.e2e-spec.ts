import * as request from 'supertest';
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
import { NewUserDTO } from '../../src/UserModule/dto/new-user.dto';
import { UserUpdateDTO } from '../../src/UserModule/dto/user-update.dto';
import { Constants } from '../../src/CommonsModule/constants';
import { GenderEnum } from '../../src/UserModule/enum/gender.enum';
import { EscolarityEnum } from '../../src/UserModule/enum/escolarity.enum';
import { UserProfileEnum } from '../../src/UserModule/enum/user-profile.enum';

const stringToBase64 = (string: string) => {
  return Buffer.from(string).toString('base64');
};

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let authorization: string;
  let adminRole: Role;
  let dbConnection: Connection;
  const adminRoleEnum: RoleEnum = RoleEnum.ADMIN;
  const userUrl = `/${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.USER_ENDPOINT}`;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    initializeTransactionalContext();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dbConnection = moduleFixture.get(Connection);
    await dbConnection.synchronize(true);

    const roleRepository: Repository<Role> = moduleFixture.get<
      Repository<Role>
    >(getRepositoryToken(Role));
    const role: Role = new Role();
    role.name = RoleEnum.ADMIN;
    const savedRole = await roleRepository.save(role);
    adminRole = savedRole;

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
            profile: UserProfileEnum.STUDENT,
            urlInstagram: 'instagram',
            urlFacebook: 'facebook',
            name: 'name',
            nickname: 'random nickname',
            gender: GenderEnum.MALE,
            schooling: EscolarityEnum.ENSINO_FUNDAMENTAL_COMPLETO,
            profession: 'random profession',
            birthday: new Date(),
            institutionName: 'random institution',
            address: 'random address',
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
            profile: UserProfileEnum.STUDENT,
            urlInstagram: 'instagram',
            urlFacebook: 'facebook',
            name: 'name',
            nickname: 'random nickname',
            gender: GenderEnum.MALE,
            schooling: EscolarityEnum.ENSINO_FUNDAMENTAL_COMPLETO,
            profession: 'random profession',
            birthday: new Date(),
            institutionName: 'random institution',
            address: 'random address',
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
            profile: UserProfileEnum.STUDENT,
            urlInstagram: 'instagram',
            urlFacebook: 'facebook',
            name: 'name',
            nickname: 'random nickname',
            gender: GenderEnum.MALE,
            schooling: EscolarityEnum.ENSINO_FUNDAMENTAL_COMPLETO,
            profession: 'random profession',
            birthday: new Date(),
            institutionName: 'random institution',
            address: 'random address',
            role: adminRoleEnum,
          } as NewUserDTO)
          .then((_res) => {
            const updateBody: UserUpdateDTO = {
              id: _res.body.id,
              email: _res.body.email,
              profile: UserProfileEnum.STUDENT,
              role: adminRoleEnum,
              name: 'updated name',
              nickname: 'random nickname',
              gender: GenderEnum.MALE,
              schooling: EscolarityEnum.ENSINO_FUNDAMENTAL_COMPLETO,
              profession: 'random profession',
              birthday: new Date(),
              institutionName: 'random institution',
              address: 'random adress',
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
            profile: UserProfileEnum.STUDENT,
            urlInstagram: 'instagram',
            urlFacebook: 'facebook',
            name: 'name',
            nickname: 'random nickname',
            gender: GenderEnum.MALE,
            schooling: EscolarityEnum.ENSINO_FUNDAMENTAL_COMPLETO,
            profession: 'random profession',
            birthday: new Date(),
            institutionName: 'random institution',
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
