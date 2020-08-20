import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { Connection, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../../src/SecurityModule/entity/role.entity';
import { RoleEnum } from '../../src/SecurityModule/enum/role.enum';
import { ClientCredentials } from '../../src/SecurityModule/entity/client-credentials.entity';
import { ClientCredentialsEnum } from '../../src/SecurityModule/enum/client-credentials.enum';
import { GrantTypeEnum } from '../../src/SecurityModule/enum/grant-type.enum';
import { EmailDTO } from '../../src/MessageModule/dto/email.dto';
import { ContactUsDTO } from '../../src/MessageModule/dto/contactus.dto';
import { MailerService } from '@nest-modules/mailer';
import { initializeTransactionalContext } from 'typeorm-transactional-cls-hooked';
import { Constants } from '../../src/CommonsModule/constants';

const stringToBase64 = (string: string) => {
  return Buffer.from(string).toString('base64');
};

describe('MessageController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let dbConnection: Connection;
  let authorization: string;
  let adminRole: Role;
  const messageUrl = `/${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.MESSAGE_ENDPOINT}`;

  const mailerServiceMock = {
    sendMail() {
      console.log('email sent');
    },
  };

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MailerService)
      .useValue(mailerServiceMock)
      .compile();

    initializeTransactionalContext();

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
    adminRole = savedRole;

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

  it('should send email', async (done) => {
    return request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS)
      .then((res) => {
        return request(app.getHttpServer())
          .post(`${messageUrl}/email`)
          .set('Authorization', `Bearer ${res.body.accessToken}`)
          .send({
            email: 'my-user1@email.com',
            title: 'teste',
            message: 'lore ypsulum teste',
            name: 'Aluno',
          } as EmailDTO)
          .expect(200)
          .then(() => done());
      });
  });

  it('should send contact us email', async (done) => {
    return request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS)
      .then((res) => {
        return request(app.getHttpServer())
          .post(`${messageUrl}/email/contactus`)
          .set('Authorization', `Bearer ${res.body.accessToken}`)
          .send({
            email: 'my-user1@email.com',
            message: 'lore ypsulum teste',
            name: 'Aluno',
            cellphone: '11900001111',
          } as ContactUsDTO)
          .expect(200)
          .then(() => done());
      });
  });

  afterAll(async () => {
    await dbConnection.synchronize(true);
    await app.close();
  });
});
