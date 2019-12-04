import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { Connection, EntityManager, QueryRunner, Repository } from 'typeorm';
import { ClientCredentials } from '../../src/SecurityModule/entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientCredentialsEnum, GrantTypeEnum } from '../../src/SecurityModule/enum';

const stringToBase64 = (string: string) => {
  return Buffer.from(string).toString('base64');
};

describe('SecurityController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let queryRunner: QueryRunner;
  let authorization: string;

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
    clientCredentials.secret = 'test';
    await clientCredentialRepository.save(clientCredentials);
    authorization = stringToBase64(`${clientCredentials.name}:${clientCredentials.secret}`);
  });

  beforeEach(async () => {
    await queryRunner.startTransaction();
  });

  afterEach(async () => {
    await queryRunner.rollbackTransaction();
  });

  it('should validate client credentials', async () => {
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
        expect(res.body.expiresIn).toBe(120);
      });
  });

  it('should throw if grant type is invalid', async () => {
    const clientCredentialRepository: Repository<ClientCredentials> = moduleFixture.get<Repository<ClientCredentials>>(getRepositoryToken(ClientCredentials));
    const clientCredentials: ClientCredentials = new ClientCredentials();
    clientCredentials.name = ClientCredentialsEnum.FRONT;
    clientCredentials.secret = 'test';
    await clientCredentialRepository.save(clientCredentials);

    const authorization = stringToBase64(`${clientCredentials.name}:${clientCredentials.secret}`);

    return request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', 'INVALID GRANT TYPE')
      .expect(400);
  });

  afterAll(async () => {
    await app.close();
  });
});
