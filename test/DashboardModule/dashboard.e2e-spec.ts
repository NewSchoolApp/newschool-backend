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
import { NewCourseDTO } from '../../src/CourseModule/dto/new-course.dto';
import { Constants } from '../../src/CommonsModule/constants';
import { NewUserDTO } from '../../src/UserModule/dto/new-user.dto';
import { CourseTaken } from '../../src/CourseModule/entity/course.taken.entity';
import { GenderEnum } from '../../src/UserModule/enum/gender.enum';
import { EscolarityEnum } from '../../src/UserModule/enum/escolarity.enum';
import { UserService } from '../../src/UserModule/service/user.service';
import { CourseService } from '../../src/CourseModule/service/course.service';
import { CourseTakenService } from '../../src/CourseModule/service/course.taken.service';
import { CourseTakenStatusEnum } from '../../src/CourseModule/enum/enum';
import { UserProfileEnum } from '../../src/UserModule/enum/user-profile.enum';
import { OrderEnum } from '../../src/CommonsModule/enum/order.enum';
import { REQUEST } from '@nestjs/core';

const stringToBase64 = (string: string) => {
  return Buffer.from(string).toString('base64');
};

describe('DashboardController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let authorization: string;
  const dashboardUrl = `/${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.DASHBOARD_ENDPOINT}`;
  const adminRoleEnum: RoleEnum = RoleEnum.ADMIN;

  let courseTakenRepository: Repository<CourseTaken>;

  let dbConnection: Connection;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(REQUEST)
      .useValue({
        headers: {
          authorization:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOiIyMDIwLTA4LTI3VDEzOjM5OjA5LjkzN1oiLCJ1cGRhdGVkQXQiOiIyMDIwLTA4LTI3VDEzOjM5OjA5LjkzN1oiLCJ2ZXJzaW9uIjoxLCJpZCI6IjUyNTM4YWI5LThlMzAtNGViYS04ZGVhLTkwYTJlNDJlMzViNSIsIm5hbWUiOiJMZW9uYXJkbyAiLCJlbWFpbCI6Imxlb0BsZW8uY29tIiwicHJvZmlsZSI6IlNUVURFTlQiLCJwYXNzd29yZCI6IjVjOGVhMjVkNzFlMmU3NDE2M2VmYmU3NzkxYjM4OTFiZmJlZGYxOWNiMmExMTFlM2I3Y2ZhZTc4YjE0NTY0YjgxN2ZjYjMyNmZkMzVkM2Q1OTlhODI3OGE4OTk3ZDNiOGJjMjlkMTQ3NDk4MGI5ODc2NjdlNmQ4NWE3ODI3NzM3Iiwibmlja25hbWUiOiJMZW8iLCJiaXJ0aGRheSI6IjE5OTgtMTItMjZUMDI6MDA6MDAuMDAwWiIsImdlbmRlciI6Ik1BTEUiLCJzY2hvb2xpbmciOiJGQUNVTERBREVfQ1VSU0FORE8iLCJpbnN0aXR1dGlvbk5hbWUiOiJHRVJBTERJTk8gRE9TIFNBTlRPUyBERVBVVEFETyIsInByb2Zlc3Npb24iOiJEZXNlbnZvbHZlZG9yIiwiYWRkcmVzcyI6IkphcmRpbSBzYW50byBhbmRyw6ksIFPDo28gUGF1bG8gLSBTw6NvIFBhdWxvLCBCcmFzaWwiLCJ1cmxGYWNlYm9vayI6IiIsInVybEluc3RhZ3JhbSI6IiIsInNhbHQiOiIzOGVhZDJiNmJlZTczZTA3MDI3NjIwNTQyZDQ3ZWIxMiIsImVuYWJsZWQiOmZhbHNlLCJmYWNlYm9va0lkIjpudWxsLCJnb29nbGVTdWIiOm51bGwsInJvbGUiOnsiY3JlYXRlZEF0IjoiMjAyMC0wOC0xMVQxMjo1MDowNS40NTdaIiwidXBkYXRlZEF0IjoiMjAyMC0wOC0xMVQxMjo1MDowNS40NTdaIiwidmVyc2lvbiI6MSwiaWQiOiIxMDJmYmY4Ni1iNmVlLTQwMWYtODViNC0wZDM3MTNkMjkzOGYiLCJuYW1lIjoiQURNSU4ifSwiaWF0IjoxNjAxMzQ0MjYxLCJleHAiOjE2MDEzNDc4NjF9.w9EI130lFaR4aEIw6EcnvEW7nmCsiKK2FTD9e9cPRig',
        },
      })
      .compile();

    initializeTransactionalContext();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dbConnection = moduleFixture.get(Connection);

    courseTakenRepository = moduleFixture.get<Repository<CourseTaken>>(
      getRepositoryToken(CourseTaken),
    );

    const userService: UserService = moduleFixture.get<UserService>(
      UserService,
    );

    const courseService: CourseService = moduleFixture.get<CourseService>(
      CourseService,
    );

    const courseTakenService: CourseTakenService = moduleFixture.get<
      CourseTakenService
    >(CourseTakenService);

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
      clientCredentials.authorizedGrantTypes = [
        GrantTypeEnum.CLIENT_CREDENTIALS,
      ];
      clientCredentials.accessTokenValidity = 3600;
      clientCredentials.refreshTokenValidity = 3600;
      await clientCredentialRepository.save(clientCredentials);
    }
    authorization = stringToBase64(
      `${clientCredentials.name}:${clientCredentials.secret}`,
    );

    const newUser: NewUserDTO = {
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
      address: 'random adress',
      institutionName: 'random institution',
      role: adminRoleEnum,
    };
    const addedUser = await userService.add(newUser);

    const newUser2: NewUserDTO = {
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
      address: 'random adress',
      institutionName: 'random institution',
      role: adminRoleEnum,
    };
    const addedUser2 = await userService.add(newUser2);

    const newCourse: NewCourseDTO = {
      title: 'Teste coursetaken E2E to add',
      thumbUrl: 'http://teste.com/thumb.png',
      authorName: 'Test',
      authorDescription: 'Test description',
      description: 'Este é um registro de teste',
      workload: 1,
    };
    const addedCourse = await courseService.add(newCourse, {
      filename: 'teste',
    });

    const newCourse2: NewCourseDTO = {
      title: 'Teste coursetaken E2E to add 2',
      thumbUrl: 'http://teste.com/thumb.png',
      authorName: 'Test',
      authorDescription: 'Test description',
      description: 'Este é um registro de teste',
      workload: 1,
    };
    const addedCourse2 = await courseService.add(newCourse2, {
      filename: 'teste',
    });

    const newCourseTaken = {
      userId: addedUser.id,
      courseId: addedCourse.id,
    };
    await courseTakenService.add(newCourseTaken);

    const newCourseTaken2 = {
      userId: addedUser.id,
      courseId: addedCourse2.id,
    };
    await courseTakenService.add(newCourseTaken2);

    const newCourseTaken3 = {
      userId: addedUser2.id,
      courseId: addedCourse2.id,
    };
    await courseTakenService.add(newCourseTaken3);

    await courseTakenService.advanceOnCourse(addedUser.id, addedCourse2.id);
    await courseTakenService.advanceOnCourse(addedUser2.id, addedCourse2.id);
  });

  it('should have 2 as quantity of certificates created', async () => {
    const authRes = await request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS);

    const dashboardRes = await request(app.getHttpServer())
      .get(`${dashboardUrl}/certificate/quantity`)
      .set('Authorization', `Bearer ${authRes.body.accessToken}`)
      .expect(200);

    expect(dashboardRes.body.totalElements).toEqual(2);
  });

  it('should return 2 as quantity of users on courses', async () => {
    const authRes = await request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS);

    const dashboardRes = await request(app.getHttpServer())
      .get(`${dashboardUrl}/course-taken/user/quantity`)
      .set('Authorization', `Bearer ${authRes.body.accessToken}`)
      .expect(200);

    expect(dashboardRes.body.totalElements).toEqual(2);
  });

  it('should return 1 as quantity of users that has TAKEN status', async () => {
    const authRes = await request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS);

    const dashboardRes = await request(app.getHttpServer())
      .get(
        `${dashboardUrl}/course-taken/user/quantity?status=${CourseTakenStatusEnum.TAKEN}`,
      )
      .set('Authorization', `Bearer ${authRes.body.accessToken}`)
      .expect(200);
    expect(dashboardRes.body.totalElements).toEqual(1);
  });

  it('should return 2 as quantity of users that has COMPLETED status', async () => {
    const authRes = await request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS);

    const dashboardRes = await request(app.getHttpServer())
      .get(
        `${dashboardUrl}/course-taken/user/quantity?status=${CourseTakenStatusEnum.COMPLETED}`,
      )
      .set('Authorization', `Bearer ${authRes.body.accessToken}`)
      .expect(200);

    expect(dashboardRes.body.totalElements).toEqual(2);
  });
  it('should return courses by views', async () => {
    const authRes = await request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS);

    const coursesByFrequence = await request(app.getHttpServer())
      .get(`${dashboardUrl}/course/views`)
      .query({ order: OrderEnum.ASC, limit: 5 })
      .set('Authorization', `Bearer ${authRes.body.accessToken}`)
      .expect(200);

    expect(coursesByFrequence.body.length).toBeLessThanOrEqual(5);
  });

  afterAll(async () => {
    await dbConnection.synchronize(true);
    await app.close();
  });
});
