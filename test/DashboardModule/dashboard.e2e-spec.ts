import * as request from 'supertest';
import * as path from 'path';
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
import { NewCourseDTO } from '../../src/CourseModule/dto/new-course.dto';
import { Course } from '../../src/CourseModule/entity/course.entity';
import { Constants } from '../../src/CommonsModule/constants';
import { NewUserDTO } from '../../src/UserModule/dto/new-user.dto';
import { CourseTaken } from '../../src/CourseTakenModule/entity/course.taken.entity';
import { User } from '../../src/UserModule/entity/user.entity';
import { GenderEnum } from '../../src/UserModule/enum/gender.enum';
import { EscolarityEnum } from '../../src/UserModule/enum/escolarity.enum';

const stringToBase64 = (string: string) => {
  return Buffer.from(string).toString('base64');
};

const fileToUpload = path.resolve(
  path.join(__dirname, '..', '..', 'README.md'),
);

describe('DashboardController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let authorization: string;
  const courseTakenUrl = `/${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.COURSE_TAKEN_ENDPOINT}`;
  const courseUrl = `/${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.COURSE_ENDPOINT}`;
  const userUrl = `/${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.USER_ENDPOINT}`;
  const dashboardUrl = `/${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.DASHBOARD_ENDPOINT}`;
  const adminRoleEnum: RoleEnum = RoleEnum.ADMIN;

  let courseTakenRepository: Repository<CourseTaken>;
  let courseRepository: Repository<Course>;
  let userRepository: Repository<User>;

  let dbConnection: Connection;

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

    courseRepository = moduleFixture.get<Repository<Course>>(
      getRepositoryToken(Course),
    );
    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
    courseTakenRepository = moduleFixture.get<Repository<CourseTaken>>(
      getRepositoryToken(CourseTaken),
    );

    const roleRepository: Repository<Role> = moduleFixture.get<
      Repository<Role>
    >(getRepositoryToken(Role));
    let roleAdmin = await roleRepository.findOne({ name: RoleEnum.ADMIN });
    if (!roleAdmin) {
      const role: Role = new Role();
      role.name = RoleEnum.ADMIN;
      roleAdmin = await roleRepository.save(role);
    }

    const clientCredentialRepository: Repository<ClientCredentials> = moduleFixture.get<
      Repository<ClientCredentials>
    >(getRepositoryToken(ClientCredentials));
    let clientCredentials = await clientCredentialRepository.findOne({
      name: ClientCredentialsEnum['NEWSCHOOL@FRONT'],
    });
    if (!clientCredentials) {
      clientCredentials = new ClientCredentials();
      clientCredentials.name = ClientCredentialsEnum['NEWSCHOOL@FRONT'];
      clientCredentials.secret = 'test2';
      clientCredentials.role = roleAdmin;
      await clientCredentialRepository.save(clientCredentials);
    }
    authorization = stringToBase64(
      `${clientCredentials.name}:${clientCredentials.secret}`,
    );
  });

  it('should return totalElements 0 if there is no certificate', async () => {
    const authRes = await request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS);

    const dashboardRes = await request(app.getHttpServer())
      .get(`${dashboardUrl}/certificate/quantity`)
      .set('Authorization', `Bearer ${authRes.body.accessToken}`)
      .expect(200);

    expect(dashboardRes.body.totalElements).toEqual(0);
  });

  it('should return the correct amount of certificates', async () => {
    const authRes = await request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS);

    const newCourse: NewCourseDTO = {
      title: 'Teste coursetaken E2E to add',
      thumbUrl: 'http://teste.com/thumb.png',
      authorName: 'Test',
      authorDescription: 'Test description',
      description: 'Este é um registro de teste',
      workload: 1,
    };
    const courseRes = await request(app.getHttpServer())
      .post(courseUrl)
      .set('Authorization', `Bearer ${authRes.body.accessToken}`)
      .field('title', newCourse.title)
      .field('thumbUrl', newCourse.thumbUrl)
      .field('authorName', newCourse.authorName)
      .field('authorDescription', newCourse.authorDescription)
      .field('description', newCourse.description)
      .field('workload', newCourse.workload)
      .attach('photo', fileToUpload);

    const newUser: NewUserDTO = {
      email: 'my-user1@email.com',
      password: 'mypass',
      urlInstagram: 'instagram',
      urlFacebook: 'facebook',
      name: 'name',
      nickname: 'random nickname',
      gender: GenderEnum.MALE,
      schooling: EscolarityEnum.ENSINO_FUNDAMENTAL_COMPLETO,
      profession: 'random profession',
      birthday: new Date(),
      address: 'random adress',
      institutionName: 'random institution',
      role: adminRoleEnum,
    };
    const userRes = await request(app.getHttpServer())
      .post(userUrl)
      .set('Authorization', `Bearer ${authRes.body.accessToken}`)
      .send(newUser);

    const newCourseTaken = {
      userId: userRes.body.id,
      courseId: courseRes.body.id,
    };
    await request(app.getHttpServer())
      .post(`${courseTakenUrl}/start-course`)
      .set('Authorization', `Bearer ${authRes.body.accessToken}`)
      .send(newCourseTaken)
      .expect(200);

    await request(app.getHttpServer())
      .post(
        `${courseTakenUrl}/advance-on-course/user/${userRes.body.id}/course/${courseRes.body.id}`,
      )
      .set('Authorization', `Bearer ${authRes.body.accessToken}`)
      .expect(200);

    const dashboardRes = await request(app.getHttpServer())
      .get(`${dashboardUrl}/certificate/quantity`)
      .set('Authorization', `Bearer ${authRes.body.accessToken}`)
      .expect(200);

    expect(dashboardRes.body.totalElements).toEqual(1);
  });

  

  afterAll(async () => {
    await dbConnection.synchronize(true);
    await app.close();
  });
});
