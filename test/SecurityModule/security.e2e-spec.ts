import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { Connection, EntityManager, QueryRunner, Repository } from 'typeorm';
import { ClientCredentials, Role } from '../../src/SecurityModule/entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientCredentialsEnum, GrantTypeEnum, RoleEnum } from '../../src/SecurityModule/enum';
import { User } from '../../src/UserModule/entity';
import * as crypto from 'crypto';

const stringToBase64 = (string: string) => {
  return Buffer.from(string).toString('base64');
};

const createSalt = (): string => {
  return crypto.randomBytes(16).toString('hex');
};

const createHashedPassword = (password: string, salt: string): string => {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
};

describe('SecurityController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let queryRunner: QueryRunner;
  let authorization: string;
  let adminRole: Role;

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
    clientCredentials.secret = 'test';
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

  it('should validate client credentials', async (done) => {
    return request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS)
      .expect(200)
      .expect((res) => {
        expect(res.body.accessToken).not.toBeNull();
        expect(res.body.refreshToken).not.toBeNull();
        expect(res.body.tokenType).toBe('bearer');
        expect(res.body.expiresIn).toBe(Number(process.env.EXPIRES_IN_ACCESS_TOKEN));
      })
      .then(() => done());
  });

  it('should throw if grant type is invalid', async (done) => {
    const clientCredentialRepository: Repository<ClientCredentials> = moduleFixture.get<Repository<ClientCredentials>>(getRepositoryToken(ClientCredentials));
    const clientCredentials: ClientCredentials = new ClientCredentials();
    clientCredentials.name = ClientCredentialsEnum.FRONT;
    clientCredentials.secret = 'test';
    clientCredentials.role = adminRole;
    await clientCredentialRepository.save(clientCredentials);

    const authorization = stringToBase64(`${clientCredentials.name}:${clientCredentials.secret}`);

    return request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', 'INVALID GRANT TYPE')
      .expect(400)
      .then(() => done());
  });

  it('should throw 404 if client credentials is wrong', async (done) => {
    return request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${stringToBase64('wrong:authorization')}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS)
      .expect(404)
      .then(() => done());
  });

  it('should validate grant type password', async (done) => {
    const userRepository: Repository<User> = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    const user: User = new User();
    const salt = createSalt();
    user.name = 'test user1';
    user.email = 'my@email.com';
    user.salt = salt;
    user.password = createHashedPassword('mypass', user.salt);
    user.urlFacebook = 'facebook';
    user.urlInstagram = 'instagram';
    user.role = adminRole;
    await userRepository.save(user);
    return request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.PASSWORD)
      .field('username', user.email)
      .field('password', 'mypass')
      .expect(200)
      .then(() => done());
  });

  it('should return 404 if user not found', async (done) => {
    return request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.PASSWORD)
      .field('username', 'randomUserEmail')
      .field('password', 'randomPass')
      .expect(404)
      .then(() => done());
  });

  afterAll(async () => {
    await app.close();
  });
});
