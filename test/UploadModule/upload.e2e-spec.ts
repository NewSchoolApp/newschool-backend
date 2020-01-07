import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { Connection, EntityManager, QueryRunner, Repository } from 'typeorm';
import { ClientCredentials, Role } from '../../src/SecurityModule/entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientCredentialsEnum, RoleEnum } from '../../src/SecurityModule/enum';
import { Constants } from '../../src/CommonsModule';
import ensureFileExistsOriginal from '../../src/UploadModule/utils/ensureFileExists';

jest.mock('../../src/UploadModule/utils/ensureFileExists')
const ensureFileExists = ensureFileExistsOriginal as jest.Mock;

describe('UploadController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let queryRunner: QueryRunner;
  const uploadUrl = `/${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.UPLOAD_ENDPOINT}`;

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

    const clientCredentialRepository: Repository<ClientCredentials> =
      moduleFixture.get<Repository<ClientCredentials>>(getRepositoryToken(ClientCredentials));
    const clientCredentials: ClientCredentials = new ClientCredentials();
    clientCredentials.name = ClientCredentialsEnum['NEWSCHOOL@FRONT'];
    clientCredentials.secret = 'test2';
    clientCredentials.role = savedRole;
    await clientCredentialRepository.save(clientCredentials);
  });

  beforeEach(async () => {
    await queryRunner.startTransaction();
  });

  afterEach(async () => {
    await queryRunner.rollbackTransaction();
  });

  it('should not get a not found file', async done => {

    ensureFileExists.mockImplementation(() => Promise.reject(new Error('Not Found')));
    return request(app.getHttpServer())
      .get(uploadUrl + '/file-not-found')
      .expect(404)
      .expect(res => {
        expect(res.body).toEqual({
          statusCode: 404,
          error: 'Not Found',
          message: `File 'file-not-found' not found`,
        });
      })
      .then(() => done());
  });

  it('should return 500 when fail to get the file', async done => {
    ensureFileExists.mockImplementation(() => Promise.resolve());
    return request(app.getHttpServer())
      .get(uploadUrl + '/file-with-error-on-get')
      .expect(500)
      .expect(res => {
        expect(res.body).toEqual({
          statusCode: 500,
          error: 'Internal Server Error',
          message: expect.any(String),
        });
      })
      .then(() => done());
  });

  afterAll(async () => {
    await app.close();
  });
});
