import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '../../src/app.module';
import { Connection, EntityManager, QueryRunner, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { initializeTransactionalContext } from 'typeorm-transactional-cls-hooked';
import { Role } from '../../src/SecurityModule/entity/role.entity';
import { RoleEnum } from '../../src/SecurityModule/enum/role.enum';
import { ClientCredentials } from '../../src/SecurityModule/entity/client-credentials.entity';
import { ClientCredentialsEnum } from '../../src/SecurityModule/enum/client-credentials.enum';
import { GrantTypeEnum } from '../../src/SecurityModule/enum/grant-type.enum';
import { User } from '../../src/UserModule/entity/user.entity';
import { GenderEnum } from '../../src/UserModule/enum/gender.enum';
import { EscolarityEnum } from '../../src/UserModule/enum/escolarity.enum';

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
  let dbConnection: Connection;
  let queryRunner: QueryRunner;
  let authorization: string;
  let adminRole: Role;
  let configService: ConfigService;
  let savedRole: Role;

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
    savedRole = await roleRepository.save(role);

    const clientCredentialRepository: Repository<ClientCredentials> = moduleFixture.get<
      Repository<ClientCredentials>
    >(getRepositoryToken(ClientCredentials));
    const clientCredentials: ClientCredentials = new ClientCredentials();
    clientCredentials.name = ClientCredentialsEnum['NEWSCHOOL@FRONT'];
    clientCredentials.secret = 'test';
    clientCredentials.role = savedRole;
    clientCredentials.grantType = GrantTypeEnum.CLIENT_CREDENTIALS;
    await clientCredentialRepository.save(clientCredentials);
    authorization = stringToBase64(
      `${clientCredentials.name}:${clientCredentials.secret}`,
    );
  });

  it('should validate client credentials', async (done) => {
    configService = app.get<ConfigService>(ConfigService);

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
        expect(res.body.expiresIn).toBe(
          configService.get<number>('EXPIRES_IN_ACCESS_TOKEN'),
        );
      })
      .then(() => done());
  });

  it('should throw if grant type is invalid', async (done) => {
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
    const clientCredentialRepository: Repository<ClientCredentials> = moduleFixture.get<
      Repository<ClientCredentials>
    >(getRepositoryToken(ClientCredentials));
    const clientCredentials: ClientCredentials = new ClientCredentials();
    clientCredentials.name = ClientCredentialsEnum['NEWSCHOOL@EXTERNAL'];
    clientCredentials.secret = 'test';
    clientCredentials.role = savedRole;
    clientCredentials.grantType = GrantTypeEnum.PASSWORD;
    await clientCredentialRepository.save(clientCredentials);

    authorization = stringToBase64(
      `${clientCredentials.name}:${clientCredentials.secret}`,
    );

    const userRepository: Repository<User> = moduleFixture.get<
      Repository<User>
    >(getRepositoryToken(User));
    const user: User = new User();
    const salt = createSalt();
    user.name = 'test user1';
    user.email = 'my@email.com';
    user.salt = salt;
    user.password = createHashedPassword('mypass', user.salt);
    user.nickname = 'random nickname';
    user.birthday = new Date();
    user.gender = GenderEnum.MALE;
    user.institutionName = 'random institution';
    user.profession = 'random profession';
    user.schooling = EscolarityEnum.ENSINO_FUNDAMENTAL_COMPLETO;
    user.address = 'random address';
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
    await dbConnection.synchronize(true);
    await app.close();
  });
});
