import * as request from 'supertest';
import * as path from 'path';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { Connection, EntityManager, QueryRunner, Repository } from 'typeorm';
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
import { Lesson } from '../../src/CourseModule/entity/lesson.entity';
import { Part } from '../../src/CourseModule/entity/part.entity';
import { NewLessonDTO } from '../../src/CourseModule/dto/new-lesson.dto';
import { NewPartDTO } from '../../src/CourseModule/dto/new-part.dto';
import { NewTestDTO } from '../../src/CourseModule/dto/new-test.dto';
import { GenderEnum } from '../../src/UserModule/enum/gender.enum';
import { EscolarityEnum } from '../../src/UserModule/enum/escolarity.enum';

const stringToBase64 = (string: string) => {
  return Buffer.from(string).toString('base64');
};

const fileToUpload = path.resolve(
  path.join(__dirname, '..', '..', 'README.md'),
);

describe('CourseTakenController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let authorization: string;
  const courseTakenUrl = `/${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.COURSE_TAKEN_ENDPOINT}`;
  const courseUrl = `/${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.COURSE_ENDPOINT}`;
  const userUrl = `/${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.USER_ENDPOINT}`;
  const lessonUrl = `/${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.LESSON_ENDPOINT}`;
  const partUrl = `/${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.PART_ENDPOINT}`;
  const testUrl = `/${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.TEST_ENDPOINT}`;
  const adminRoleEnum: RoleEnum = RoleEnum.ADMIN;

  let courseTakenRepository: Repository<CourseTaken>;
  let courseRepository: Repository<Course>;
  let userRepository: Repository<User>;

  let lessonRepository: Repository<Lesson>;
  let partRepository: Repository<Part>;
  let testRepository: Repository<Test>;

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

    lessonRepository = moduleFixture.get<Repository<Lesson>>(
      getRepositoryToken(Lesson),
    );
    partRepository = moduleFixture.get<Repository<Part>>(
      getRepositoryToken(Part),
    );
    testRepository = moduleFixture.get<Repository<Test>>(
      getRepositoryToken(Test),
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

  it('should create a coursetaken', async () => {
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

    const addedCourseTaken = await courseTakenRepository.findOne(
      {
        user: await userRepository.findOneOrFail(newCourseTaken.userId),
        course: await courseRepository.findOneOrFail(newCourseTaken.courseId),
      },
      { relations: ['user', 'course'] },
    );
    expect(addedCourseTaken.user.id).toEqual(newCourseTaken.userId);
    expect(addedCourseTaken.course.id).toEqual(newCourseTaken.courseId);
  });

  it('should throw 404 error if user not found when creating coursetaken', async () => {
    const authRes = await request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS);
    const newCourse: NewCourseDTO = {
      title: 'Teste coursetaken E2E to add 2',
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

    const newCourseTaken = {
      userId: 'randomuuid',
      courseId: courseRes.body.id,
    };
    await request(app.getHttpServer())
      .post(`${courseTakenUrl}/start-course`)
      .set('Authorization', `Bearer ${authRes.body.accessToken}`)
      .send(newCourseTaken)
      .expect(404);
  });

  it('should throw 404 error if course is not found when creating coursetaken', async () => {
    const authRes = await request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS);
    const newUser: NewUserDTO = {
      email: 'my-user3@email.com',
      password: 'mypass',
      urlInstagram: 'instagram',
      urlFacebook: 'facebook',
      name: 'name',
      nickname: 'random nickname',
      gender: GenderEnum.MALE,
      schooling: EscolarityEnum.ENSINO_FUNDAMENTAL_COMPLETO,
      profession: 'random profession',
      birthday: new Date(),
      institutionName: 'random institution',
      role: adminRoleEnum,
    };
    const userRes: request.Response = await request(app.getHttpServer())
      .post(userUrl)
      .set('Authorization', `Bearer ${authRes.body.accessToken}`)
      .send(newUser);

    const newCourseTaken = {
      userId: userRes.body.id,
      courseId: 'randomuuid',
    };
    await request(app.getHttpServer())
      .post(`${courseTakenUrl}/start-course`)
      .set('Authorization', `Bearer ${authRes.body.accessToken}`)
      .send(newCourseTaken)
      .expect(404);
  });

  it('should throw 409 error if user has already started this course', async () => {
    const authRes = await request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS);
    const newCourse: NewCourseDTO = {
      title: 'Teste coursetaken E2E to add 4',
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
      email: 'my-user4@email.com',
      password: 'mypass',
      urlInstagram: 'instagram',
      urlFacebook: 'facebook',
      name: 'name',
      nickname: 'random nickname',
      gender: GenderEnum.MALE,
      schooling: EscolarityEnum.ENSINO_FUNDAMENTAL_COMPLETO,
      profession: 'random profession',
      birthday: new Date(),
      institutionName: 'random institution',
      role: adminRoleEnum,
    };
    const userRes: request.Response = await request(app.getHttpServer())
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
      .post(`${courseTakenUrl}/start-course`)
      .set('Authorization', `Bearer ${authRes.body.accessToken}`)
      .send(newCourseTaken)
      .expect(409);
  });

  it('should advance user to the next test', async () => {
    const authRes = await request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS);

    const newUser: NewUserDTO = {
      email: 'my-user5@email.com',
      password: 'mypass',
      urlInstagram: 'instagram',
      urlFacebook: 'facebook',
      name: 'name',
      nickname: 'random nickname',
      gender: GenderEnum.MALE,
      schooling: EscolarityEnum.ENSINO_FUNDAMENTAL_COMPLETO,
      profession: 'random profession',
      birthday: new Date(),
      institutionName: 'random institution',
      role: adminRoleEnum,
    };
    const newCourse: NewCourseDTO = {
      title: 'Teste coursetaken E2E to add 5',
      thumbUrl: 'http://teste.com/thumb.png',
      authorName: 'Test',
      authorDescription: 'Test description',
      description: 'Este é um registro de teste',
      workload: 1,
    };
    const [userRes, courseRes] = await Promise.all([
      request(app.getHttpServer())
        .post(userUrl)
        .set('Authorization', `Bearer ${authRes.body.accessToken}`)
        .send(newUser)
        .expect(201),
      request(app.getHttpServer())
        .post(courseUrl)
        .set('Authorization', `Bearer ${authRes.body.accessToken}`)
        .field('title', newCourse.title)
        .field('thumbUrl', newCourse.thumbUrl)
        .field('authorName', newCourse.authorName)
        .field('authorDescription', newCourse.authorDescription)
        .field('description', newCourse.description)
        .field('workload', newCourse.workload)
        .attach('photo', fileToUpload)
        .expect(201),
    ]);

    const newLesson: NewLessonDTO = {
      courseId: courseRes.body.id,
      description: 'new lesson description 1',
      title: 'new lesson title 1',
    };
    const lessonRes = await request(app.getHttpServer())
      .post(lessonUrl)
      .set('Authorization', `Bearer ${authRes.body.accessToken}`)
      .send(newLesson)
      .expect(201);

    const newPart: NewPartDTO = {
      lessonId: lessonRes.body.id,
      description: 'new part description 1',
      title: 'new part title 1',
      vimeoUrl: 'new part vimeo url 1',
      youtubeUrl: 'new part youtube url 1',
    };
    const partRes = await request(app.getHttpServer())
      .post(partUrl)
      .set('Authorization', `Bearer ${authRes.body.accessToken}`)
      .send(newPart)
      .expect(201);

    const newTest: NewTestDTO = {
      partId: partRes.body.id,
      title: 'new test 1',
      question: 'new test 1',
      correctAlternative: '4',
      firstAlternative: 'wrong first alternative 1',
      secondAlternative: 'wrong second alternative 1',
      thirdAlternative: 'wrong third alternative 1',
      fourthAlternative: 'right fourth alternative 1',
    };
    const newTest2: NewTestDTO = {
      partId: partRes.body.id,
      title: 'new test 2',
      question: 'new test 2',
      correctAlternative: '4',
      firstAlternative: 'wrong first alternative 2',
      secondAlternative: 'wrong second alternative 2',
      thirdAlternative: 'wrong third alternative 2',
      fourthAlternative: 'right fourth alternative 2',
    };

    const testRes = await request(app.getHttpServer())
      .post(testUrl)
      .set('Authorization', `Bearer ${authRes.body.accessToken}`)
      .send(newTest)
      .expect(201);

    const testRes2 = await request(app.getHttpServer())
      .post(testUrl)
      .set('Authorization', `Bearer ${authRes.body.accessToken}`)
      .send(newTest2)
      .expect(201);

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

    const addedCourseTaken = await courseTakenRepository.findOne(
      {
        user: await userRepository.findOneOrFail(newCourseTaken.userId),
        course: await courseRepository.findOneOrFail(newCourseTaken.courseId),
      },
      {
        relations: [
          'user',
          'course',
          'currentLesson',
          'currentPart',
          'currentTest',
        ],
      },
    );
    expect(addedCourseTaken.currentTest.id).toEqual(testRes.body.id);

    await request(app.getHttpServer())
      .post(
        `${courseTakenUrl}/advance-on-course/user/${userRes.body.id}/course/${courseRes.body.id}`,
      )
      .set('Authorization', `Bearer ${authRes.body.accessToken}`)
      .expect(200);

    const addedCourseTaken2 = await courseTakenRepository.findOne(
      {
        user: await userRepository.findOneOrFail(newCourseTaken.userId),
        course: await courseRepository.findOneOrFail(newCourseTaken.courseId),
      },
      {
        relations: [
          'user',
          'course',
          'currentLesson',
          'currentPart',
          'currentTest',
        ],
      },
    );
    expect(addedCourseTaken2.currentTest.id).toEqual(testRes2.body.id);
  });

  it('should advance user to the next part', async () => {
    const authRes = await request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS);
    const newCourse: NewCourseDTO = {
      title: 'Teste coursetaken E2E to add 6',
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

    const newLesson: NewLessonDTO = {
      courseId: courseRes.body.id,
      description: 'new lesson description 2',
      title: 'new lesson title 2',
    };
    const lessonRes = await request(app.getHttpServer())
      .post(lessonUrl)
      .set('Authorization', `Bearer ${authRes.body.accessToken}`)
      .send(newLesson);

    const newPart: NewPartDTO = {
      lessonId: lessonRes.body.id,
      description: 'new part description 2',
      title: 'new part title 2',
      vimeoUrl: 'new part vimeo url 2',
      youtubeUrl: 'new part youtube url 2',
    };
    const partRes = await request(app.getHttpServer())
      .post(partUrl)
      .set('Authorization', `Bearer ${authRes.body.accessToken}`)
      .send(newPart);

    const newPart2: NewPartDTO = {
      lessonId: lessonRes.body.id,
      description: 'new part description 3',
      title: 'new part title 3',
      vimeoUrl: 'new part vimeo url 3',
      youtubeUrl: 'new part youtube url 3',
    };
    const partRes2 = await request(app.getHttpServer())
      .post(partUrl)
      .set('Authorization', `Bearer ${authRes.body.accessToken}`)
      .send(newPart2);

    const newTest: NewTestDTO = {
      partId: partRes.body.id,
      title: 'new test 3',
      question: 'new test 3',
      correctAlternative: '4',
      firstAlternative: 'wrong first alternative 2',
      secondAlternative: 'wrong second alternative 2',
      thirdAlternative: 'wrong third alternative 2',
      fourthAlternative: 'right fourth alternative 2',
    };
    await request(app.getHttpServer())
      .post(testUrl)
      .set('Authorization', `Bearer ${authRes.body.accessToken}`)
      .send(newTest);

    const newUser: NewUserDTO = {
      email: 'my-user6@email.com',
      password: 'mypass',
      urlInstagram: 'instagram',
      urlFacebook: 'facebook',
      name: 'name',
      nickname: 'random nickname',
      gender: GenderEnum.MALE,
      schooling: EscolarityEnum.ENSINO_FUNDAMENTAL_COMPLETO,
      profession: 'random profession',
      birthday: new Date(),
      institutionName: 'random institution',
      role: adminRoleEnum,
    };
    const userRes: request.Response = await request(app.getHttpServer())
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
      .set('Authorization', `Bearer ${authRes.body.accessToken}`);

    const addedCourseTaken = await courseTakenRepository.findOne(
      {
        user: await userRepository.findOneOrFail(newCourseTaken.userId),
        course: await courseRepository.findOneOrFail(newCourseTaken.courseId),
      },
      {
        relations: [
          'user',
          'course',
          'currentLesson',
          'currentPart',
          'currentTest',
        ],
      },
    );
    expect(addedCourseTaken.currentPart.id).toEqual(partRes.body.id);

    await request(app.getHttpServer())
      .post(
        `${courseTakenUrl}/advance-on-course/user/${userRes.body.id}/course/${courseRes.body.id}`,
      )
      .set('Authorization', `Bearer ${authRes.body.accessToken}`);

    const addedCourseTaken2 = await courseTakenRepository.findOne(
      {
        user: await userRepository.findOneOrFail(newCourseTaken.userId),
        course: await courseRepository.findOneOrFail(newCourseTaken.courseId),
      },
      {
        relations: [
          'user',
          'course',
          'currentLesson',
          'currentPart',
          'currentTest',
        ],
      },
    );
    expect(addedCourseTaken2.currentPart.id).toEqual(partRes2.body.id);
  });

  it('should advance user to the next lesson', async () => {
    const authRes = await request(app.getHttpServer())
      .post('/oauth/token')
      .set('Authorization', `Basic ${authorization}`)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', GrantTypeEnum.CLIENT_CREDENTIALS);
    const newUser: NewUserDTO = {
      email: 'my-user7@email.com',
      password: 'mypass',
      urlInstagram: 'instagram',
      urlFacebook: 'facebook',
      name: 'name',
      nickname: 'random nickname',
      gender: GenderEnum.MALE,
      schooling: EscolarityEnum.ENSINO_FUNDAMENTAL_COMPLETO,
      profession: 'random profession',
      birthday: new Date(),
      institutionName: 'random institution',
      role: adminRoleEnum,
    };
    const newCourse: NewCourseDTO = {
      title: 'Teste coursetaken E2E to add 7',
      thumbUrl: 'http://teste.com/thumb.png',
      authorName: 'Test',
      authorDescription: 'Test description',
      description: 'Este é um registro de teste',
      workload: 1,
    };
    const [userRes, courseRes] = await Promise.all([
      request(app.getHttpServer())
        .post(userUrl)
        .set('Authorization', `Bearer ${authRes.body.accessToken}`)
        .send(newUser)
        .expect(201),
      request(app.getHttpServer())
        .post(courseUrl)
        .set('Authorization', `Bearer ${authRes.body.accessToken}`)
        .field('title', newCourse.title)
        .field('thumbUrl', newCourse.thumbUrl)
        .field('authorName', newCourse.authorName)
        .field('authorDescription', newCourse.authorDescription)
        .field('description', newCourse.description)
        .field('workload', newCourse.workload)
        .attach('photo', fileToUpload)
        .expect(201),
    ]);
    const newLesson: NewLessonDTO = {
      courseId: courseRes.body.id,
      description: 'new lesson description 3',
      title: 'new lesson title 3',
    };
    const newLesson2: NewLessonDTO = {
      courseId: courseRes.body.id,
      description: 'new lesson description 4',
      title: 'new lesson title 4',
    };
    const lessonRes = await request(app.getHttpServer())
      .post(lessonUrl)
      .set('Authorization', `Bearer ${authRes.body.accessToken}`)
      .send(newLesson)
      .expect(201);
    const lessonRes2 = await request(app.getHttpServer())
      .post(lessonUrl)
      .set('Authorization', `Bearer ${authRes.body.accessToken}`)
      .send(newLesson2)
      .expect(201);

    const newPart: NewPartDTO = {
      lessonId: lessonRes.body.id,
      description: 'new part description 3',
      title: 'new part title 3',
      vimeoUrl: 'new part vimeo url 3',
      youtubeUrl: 'new part youtube url 3',
    };
    const newPart2: NewPartDTO = {
      lessonId: lessonRes2.body.id,
      description: 'new part description 4',
      title: 'new part title 4',
      vimeoUrl: 'new part vimeo url 4',
      youtubeUrl: 'new part youtube url 4',
    };

    const partRes = await request(app.getHttpServer())
      .post(partUrl)
      .set('Authorization', `Bearer ${authRes.body.accessToken}`)
      .send(newPart)
      .expect(201);
    const partRes2 = await request(app.getHttpServer())
      .post(partUrl)
      .set('Authorization', `Bearer ${authRes.body.accessToken}`)
      .send(newPart2)
      .expect(201);

    const newTest: NewTestDTO = {
      partId: partRes.body.id,
      title: 'new test 4',
      question: 'new test 4',
      correctAlternative: '4',
      firstAlternative: 'wrong first alternative 3',
      secondAlternative: 'wrong second alternative 3',
      thirdAlternative: 'wrong third alternative 3',
      fourthAlternative: 'right fourth alternative 3',
    };
    const newTest2: NewTestDTO = {
      partId: partRes2.body.id,
      title: 'new test 4',
      question: 'new test 4',
      correctAlternative: '4',
      firstAlternative: 'wrong first alternative 4',
      secondAlternative: 'wrong second alternative 4',
      thirdAlternative: 'wrong third alternative 4',
      fourthAlternative: 'right fourth alternative 4',
    };
    await request(app.getHttpServer())
      .post(testUrl)
      .set('Authorization', `Bearer ${authRes.body.accessToken}`)
      .send(newTest)
      .expect(201);
    await request(app.getHttpServer())
      .post(testUrl)
      .set('Authorization', `Bearer ${authRes.body.accessToken}`)
      .send(newTest2)
      .expect(201);

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
      .set('Authorization', `Bearer ${authRes.body.accessToken}`);

    const addedCourseTaken = await courseTakenRepository.findOne(
      {
        user: await userRepository.findOneOrFail(newCourseTaken.userId),
        course: await courseRepository.findOneOrFail(newCourseTaken.courseId),
      },
      {
        relations: [
          'user',
          'course',
          'currentLesson',
          'currentPart',
          'currentTest',
        ],
      },
    );
    expect(addedCourseTaken.currentLesson.id).toEqual(lessonRes.body.id);

    await request(app.getHttpServer())
      .post(
        `${courseTakenUrl}/advance-on-course/user/${userRes.body.id}/course/${courseRes.body.id}`,
      )
      .set('Authorization', `Bearer ${authRes.body.accessToken}`);

    const addedCourseTaken2 = await courseTakenRepository.findOne(
      {
        user: await userRepository.findOneOrFail(newCourseTaken.userId),
        course: await courseRepository.findOneOrFail(newCourseTaken.courseId),
      },
      {
        relations: [
          'user',
          'course',
          'currentLesson',
          'currentPart',
          'currentTest',
        ],
      },
    );
    expect(addedCourseTaken2.currentLesson.id).toEqual(lessonRes2.body.id);
  });

  afterAll(async () => {
    await dbConnection.synchronize(true);
    await app.close();
  });
});
