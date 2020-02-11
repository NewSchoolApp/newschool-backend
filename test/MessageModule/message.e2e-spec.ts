import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientCredentials, Role } from '../../src/SecurityModule/entity';
import {
  ClientCredentialsEnum,
  GrantTypeEnum,
  RoleEnum,
} from '../../src/SecurityModule/enum';
import { Constants } from '../../src/CommonsModule';
import { EmailDTO, ContactUsDTO } from '../../src/MessageModule/dto';
import { initializeTransactionalContext } from 'typeorm-transactional-cls-hooked';

const stringToBase64 = (string: string) => {
  return Buffer.from(string).toString('base64');
};

const emailToSend = 'no-reply-dev@newschoolapp.com.br';

describe('MessageController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let authorization: string;
  const messageUrl = `/${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.MESSAGE_ENDPOINT}`;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    initializeTransactionalContext();

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
    clientCredentials.name = ClientCredentialsEnum['NEWSCHOOL@EXTERNAL'];
    clientCredentials.secret = 'NEWSCHOOL@EXTERNALSECRET';
    clientCredentials.role = savedRole;
    await clientCredentialRepository.save(clientCredentials);
    authorization = stringToBase64(
      `${clientCredentials.name}:${clientCredentials.secret}`,
    );
  });

  it('should send email', async done => {
    return request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS)
      .then(res => {
        return request(app.getHttpServer())
          .post(messageUrl + '/email')
          .set('Authorization', `Bearer ${res.body.accessToken}`)
          .send({
            email: emailToSend,
            title: 'teste',
            message: 'lore ypsulum teste',
            name: 'Aluno',
          } as EmailDTO)
          .expect(201)
          .then(() => done());
      });
  });

  it('should send contact us email', async done => {
    return request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS)
      .then(res => {
        return request(app.getHttpServer())
          .post(messageUrl + '/email/contactus')
          .set('Authorization', `Bearer ${res.body.accessToken}`)
          .send({
            cellphone: '(19)94034-3404',
            email: emailToSend,
            message: 'lore ypsulum teste',
            name: 'Aluno',
          } as ContactUsDTO)
          .expect(201)
          .then(() => done());
      });
  });

  afterAll(async () => {
    const clientCredentialRepository: Repository<ClientCredentials> = moduleFixture.get<
      Repository<ClientCredentials>
    >(getRepositoryToken(ClientCredentials));
    const clients = await clientCredentialRepository.find({
      name: ClientCredentialsEnum['NEWSCHOOL@EXTERNAL'],
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
