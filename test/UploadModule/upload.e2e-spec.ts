/* eslint-disable @typescript-eslint/no-explicit-any */
import * as request from 'supertest';
import * as fs from 'fs';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { Connection, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../../src/SecurityModule/entity/role.entity';
import { RoleEnum } from '../../src/SecurityModule/enum/role.enum';
import { ClientCredentials } from '../../src/SecurityModule/entity/client-credentials.entity';
import { ClientCredentialsEnum } from '../../src/SecurityModule/enum/client-credentials.enum';
import { Constants } from '../../src/CommonsModule/constants';

describe('UploadController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let dbConnection: Connection;
  const uploadUrl = `/${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.UPLOAD_ENDPOINT}`;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dbConnection = moduleFixture.get(Connection);

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
  });

  it('should not get a not found file', async (done) => {
    const mockAccess = jest.spyOn(fs, 'access');
    // @ts-ignore
    mockAccess.mockImplementationOnce((path, mode, callback) => {
      callback(new Error('Not Found'));
    });
    return request(app.getHttpServer())
      .get(uploadUrl + '/file-not-found')
      .expect(404)
      .expect((res) => {
        expect(res.body).toEqual({
          statusCode: 404,
          error: 'Not Found',
          message: `File 'file-not-found' not found`,
        });
      })
      .then(() => done());
  });

  it('should return 404 when fail to get the file', async (done) => {
    const mockAccess = jest.spyOn(fs, 'access');
    // @ts-ignore
    mockAccess.mockImplementationOnce((path, mode, callback) => {
      callback();
    });
    return request(app.getHttpServer())
      .get(uploadUrl + '/file-with-error-on-get')
      .expect(404)
      .expect((res) => {
        expect(res.body).toStrictEqual({
          error: 'Not Found',
          message: expect.any(String),
          statusCode: 404,
        });
      })
      .then(() => done());
  });

  it('should return 200 when get the file with success', async (done) => {
    const mockAccess = jest.spyOn(fs, 'access');
    // @ts-ignore
    mockAccess.mockImplementationOnce((path, mode, callback) => {
      callback();
    });
    const fileName = 'file-created-to-test';
    const filePath = `${__dirname}/../../upload/${fileName}`;
    fs.writeFileSync(filePath, '1');
    return request(app.getHttpServer())
      .get(`${uploadUrl}/${fileName}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeTruthy();
      })
      .then(() => {
        fs.unlinkSync(filePath);
        done();
      });
  });

  afterAll(async () => {
    await dbConnection.synchronize(true);
    await app.close();
  });
});
