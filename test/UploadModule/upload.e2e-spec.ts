/* eslint-disable @typescript-eslint/no-explicit-any */
import * as request from 'supertest';
import * as fs from 'fs';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { Connection, EntityManager, QueryRunner, Repository } from 'typeorm';
import { ClientCredentials, Role } from '../../src/SecurityModule/entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientCredentialsEnum, RoleEnum } from '../../src/SecurityModule/enum';
import { Constants } from '../../src/CommonsModule';

describe('UploadController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  const uploadUrl = `/${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.UPLOAD_ENDPOINT}`;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

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

  it('should not get a not found file', async done => {
    const mockAccess = jest.spyOn(fs, 'access');
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    mockAccess.mockImplementationOnce((path, mode, callback) => {
      callback(new Error('Not Found'));
    });
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

  it('should return 404 when file not exists', async done => {
    const mockAccess = jest.spyOn(fs, 'access');
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    mockAccess.mockImplementationOnce((path, mode, callback) => {
      callback();
    });
    return request(app.getHttpServer())
      .get(uploadUrl + '/file-with-error-on-get')
      .expect(404)
      .expect(res => {
        expect(res.body).toStrictEqual({
          error: 'Not Found',
          message: expect.any(String),
          statusCode: 404,
        });
      })
      .then(() => done());
  });

  it('should return 200 when get the file with success', async () => {
    const mockAccess = jest.spyOn(fs, 'access');
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    mockAccess.mockImplementationOnce((path, mode, callback) => {
      callback();
    });
    const fileName = 'file-created-to-test';
    const filePath = `${__dirname}/../../upload/${fileName}`;
    fs.writeFileSync(filePath, '1');
    return request(app.getHttpServer())
      .get(uploadUrl + '/' + fileName)
      .expect(200)
      .expect(res => {
        expect(res.body).toBeTruthy();
      })
      .then(() => {
        fs.unlinkSync(filePath);
      });
  });

  afterAll(async () => {
    const clientCredentialRepository: Repository<ClientCredentials> = moduleFixture.get<
      Repository<ClientCredentials>
    >(getRepositoryToken(ClientCredentials));
    const clients = await clientCredentialRepository.find({
      name: ClientCredentialsEnum['NEWSCHOOL@FRONT'],
    });
    if (clients.length) {
      await clientCredentialRepository.remove(clients[0]);
    }
    const roleRepository: Repository<Role> = moduleFixture.get<
      Repository<Role>
    >(getRepositoryToken(Role));
    const roles = await roleRepository.find({
      name: RoleEnum.ADMIN,
    });
    if (roles.length) {
      await roleRepository.remove(roles[0]);
    }
    await app.close();
  });
});
