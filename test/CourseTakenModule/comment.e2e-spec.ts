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
import { Constants } from '../../src/CommonsModule/constants';
import { NewUserDTO } from '../../src/UserModule/dto/new-user.dto';
import { User } from '../../src/UserModule/entity/user.entity';
import { GenderEnum } from '../../src/UserModule/enum/gender.enum';
import { EscolarityEnum } from '../../src/UserModule/enum/escolarity.enum';
import { UserProfileEnum } from '../../src/UserModule/enum/user-profile.enum';
import { AddCommentDTO } from '../../src/CourseModule/dto/add-comment.dto';
import { UserService } from '../../src/UserModule/service/user.service';
import { REQUEST } from '@nestjs/core';
import { UploadService } from '../../src/UploadModule/service/upload.service';
import { LikeCommentDTO } from '../../src/CourseModule/dto/like-comment.dto';
import { CourseTaken } from '../../src/CourseModule/entity/course-taken.entity';

const stringToBase64 = (string: string) => {
  return Buffer.from(string).toString('base64');
};

describe('CommentController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let authorization: string;
  const commentUrl = `/${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.COMMENT_ENDPOINT}`;
  const studentRoleEnum: RoleEnum = RoleEnum.STUDENT;

  let dbConnection: Connection;

  let addedUser: User;

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
      .overrideProvider(UploadService)
      .useValue({
        getUserPhoto() {
          return Promise.resolve('photo url');
        },
      })
      .compile();

    initializeTransactionalContext();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dbConnection = moduleFixture.get(Connection);
    await dbConnection.synchronize(true);

    const roleRepository: Repository<Role> = moduleFixture.get<
      Repository<Role>
    >(getRepositoryToken(Role));
    let roleAdmin = await roleRepository.findOne({ name: RoleEnum.ADMIN });
    if (!roleAdmin) {
      const role: Role = new Role();
      role.name = RoleEnum.STUDENT;
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

    const userService: UserService = moduleFixture.get<UserService>(
      UserService,
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
      role: studentRoleEnum,
    };
    addedUser = await userService.add(newUser);

    const addedCourse = {
      id: new Date().getTime(),
    };

    const courseTakenRepository = moduleFixture.get<Repository<CourseTaken>>(
      getRepositoryToken(CourseTaken),
    );

    const newCourseTaken = {
      userId: addedUser.id,
      courseId: addedCourse.id,
      currentLessonId: 1,
      currentPartId: 2,
    };
    await courseTakenRepository.save(newCourseTaken);
  });

  it('should add comment', async (done) => {
    const oauthRequest = await request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS);

    const partId = 1;

    const addComentBody: AddCommentDTO = {
      partId,
      text: 'random text',
      userId: addedUser.id,
    };

    const addCommentRequest = await request(app.getHttpServer())
      .post(commentUrl)
      .set('Authorization', `Bearer ${oauthRequest.body.accessToken}`)
      .send(addComentBody);

    expect(addCommentRequest.body.user.id).toBe(addedUser.id);
    expect(addCommentRequest.body.responses).toStrictEqual([]);
    expect(addCommentRequest.body.likedBy).toStrictEqual([]);
    expect(addCommentRequest.body.partId).toBe(partId);
    expect(addCommentRequest.body.text).toBe(addComentBody.text);
    done();
  });

  it('should like comment', async (done) => {
    const oauthRequest = await request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS);

    const partId = 2;

    const addComentBody: AddCommentDTO = {
      partId,
      text: 'random text',
      userId: addedUser.id,
    };

    const addCommentRequest = await request(app.getHttpServer())
      .post(commentUrl)
      .set('Authorization', `Bearer ${oauthRequest.body.accessToken}`)
      .send(addComentBody);

    const likeComentBody: LikeCommentDTO = {
      userId: addedUser.id,
    };

    await request(app.getHttpServer())
      .post(`${commentUrl}/${addCommentRequest.body.id}/like`)
      .set('Authorization', `Bearer ${oauthRequest.body.accessToken}`)
      .send(likeComentBody);

    const getCommentRequest = await request(app.getHttpServer())
      .get(`${commentUrl}/part/${partId}`)
      .set('Authorization', `Bearer ${oauthRequest.body.accessToken}`);

    const filterComments = getCommentRequest.body.filter(
      (comment) => comment.id === addCommentRequest.body.id,
    );
    const comment = filterComments[0];

    expect(comment.likedBy.length).toBe(1);
    expect(comment.likedBy[0].id).toBe(addedUser.id);
    done();
  });

  it('should add a response to a comment', async (done) => {
    const oauthRequest = await request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS);

    const partId = 3;

    const addComentBody: AddCommentDTO = {
      partId,
      text: 'random text',
      userId: addedUser.id,
    };

    const addCommentRequest = await request(app.getHttpServer())
      .post(commentUrl)
      .set('Authorization', `Bearer ${oauthRequest.body.accessToken}`)
      .send(addComentBody);

    const addCommentResponseBody: AddCommentDTO = {
      partId,
      text: 'random text',
      userId: addedUser.id,
    };

    const addCommentResponseRequest = await request(app.getHttpServer())
      .post(`${commentUrl}/${addCommentRequest.body.id}/response`)
      .set('Authorization', `Bearer ${oauthRequest.body.accessToken}`)
      .send(addCommentResponseBody);

    expect(addCommentResponseRequest.body.parentComment.responses.length).toBe(
      0,
    );
    expect(addCommentResponseRequest.body.parentComment.id).toBe(
      addCommentRequest.body.id,
    );

    const getParentCommentResponsesRequest = await request(app.getHttpServer())
      .get(`${commentUrl}/${addCommentRequest.body.id}/response`)
      .set('Authorization', `Bearer ${oauthRequest.body.accessToken}`);

    expect(getParentCommentResponsesRequest.body.responses.length).toBe(1);

    done();
  });

  it('should not be able to add a response to a response', async (done) => {
    const oauthRequest = await request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS);

    const partId = 4;

    const addComentBody: AddCommentDTO = {
      partId,
      text: 'random text',
      userId: addedUser.id,
    };

    const addCommentRequest = await request(app.getHttpServer())
      .post(commentUrl)
      .set('Authorization', `Bearer ${oauthRequest.body.accessToken}`)
      .send(addComentBody);

    const addCommentResponseBody: AddCommentDTO = {
      partId,
      text: 'random text',
      userId: addedUser.id,
    };

    const addCommentResponseRequest = await request(app.getHttpServer())
      .post(`${commentUrl}/${addCommentRequest.body.id}/response`)
      .set('Authorization', `Bearer ${oauthRequest.body.accessToken}`)
      .send(addCommentResponseBody);

    const addResponseToResponseRequest = await request(app.getHttpServer())
      .post(`${commentUrl}/${addCommentResponseRequest.body.id}/response`)
      .set('Authorization', `Bearer ${oauthRequest.body.accessToken}`)
      .send(addCommentResponseBody);

    expect(addResponseToResponseRequest.status).toBe(400);

    done();
  });

  afterAll(async () => {
    await app.close();
  });
});
