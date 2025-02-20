/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import jwt, { JwtPayload } from 'jsonwebtoken';
import type { Prisma } from '@prisma/client';
import { ObjectId } from 'mongodb';
import _ from 'lodash';

import { createUserInput } from '../../utils/create-user';
import {
  defaultUserId,
  defaultUserEmail,
  devLogin,
  setupServer,
  superRequest,
  createSuperRequest
} from '../../../jest.utils';
import { JWT_SECRET } from '../../utils/env';
import {
  clearEnvExam,
  seedEnvExam,
  seedEnvExamAttempt,
  seedExamEnvExamAuthToken
} from '../../../__mocks__/env-exam';
import { getMsTranscriptApiUrl } from './user';

const mockedFetch = jest.fn();
jest.spyOn(globalThis, 'fetch').mockImplementation(mockedFetch);

// This is used to build a test user.
const testUserData: Prisma.userCreateInput = {
  ...createUserInput(defaultUserEmail),
  username: 'foobar',
  usernameDisplay: 'Foo Bar',
  progressTimestamps: [1520002973119, 1520440323273],
  completedChallenges: [
    {
      id: 'a6b0bb188d873cb2c8729495',
      completedDate: 1520002973119,
      solution: null,
      challengeType: 5,
      files: [
        {
          contents: 'test',
          ext: 'js',
          key: 'indexjs',
          name: 'test',
          path: 'path-test'
        },
        {
          contents: 'test2',
          ext: 'html',
          key: 'html-test',
          name: 'test2'
        }
      ]
    },
    {
      id: 'a5229172f011153519423690',
      completedDate: 1520440323273,
      solution: null,
      challengeType: 5,
      files: []
    },
    {
      id: 'a5229172f011153519423692',
      completedDate: 1520440323274,
      githubLink: '',
      challengeType: 5,
      examResults: {
        numberOfCorrectAnswers: 0,
        numberOfQuestionsInExam: 0,
        percentCorrect: 0,
        passingPercent: 0,
        passed: false,
        examTimeInSeconds: 0
      }
    }
  ],
  partiallyCompletedChallenges: [{ id: '123', completedDate: 123 }],
  completedExams: [],
  quizAttempts: [
    {
      challengeId: '66df3b712c41c499e9d31e5b',
      quizId: '0',
      timestamp: 1731924665902
    }
  ],
  githubProfile: 'github.com/foobar',
  website: 'https://www.freecodecamp.org',
  donationEmails: ['an@add.ress'],
  portfolio: [
    {
      description: 'A portfolio',
      id: 'a6b0bb188d873cb2c8729495',
      image: 'https://www.freecodecamp.org/cat.png',
      title: 'A portfolio',
      url: 'https://www.freecodecamp.org'
    }
  ],
  savedChallenges: [
    {
      id: 'a6b0bb188d873cb2c8729495',
      lastSavedDate: 123,
      files: [
        {
          contents: 'test-contents',
          ext: 'js',
          history: ['indexjs'],
          key: 'indexjs',
          name: 'test-name'
        }
      ]
    }
  ],
  yearsTopContributor: ['2018'],
  twitter: '@foobar',
  linkedin: 'linkedin.com/foobar'
};

const minimalUserData: Prisma.userCreateInput = {
  about: 'I am a test user',
  acceptedPrivacyTerms: true,
  email: testUserData.email,
  emailVerified: true,
  externalId: '1234567890',
  isDonating: false,
  picture: 'https://www.freecodecamp.org/cat.png',
  sendQuincyEmail: true,
  username: 'testuser',
  unsubscribeId: '1234567890'
};

const lockedProfileUI = {
  isLocked: true,
  showAbout: false,
  showCerts: false,
  showDonation: false,
  showHeatMap: false,
  showLocation: false,
  showName: false,
  showPoints: false,
  showPortfolio: false,
  showCareer: false,
  showTimeLine: false
};

// These are not part of the schema, but are added to the user object by
// get-session-user's handler
const computedProperties = {
  calendar: {},
  completedChallengeCount: 0,
  isEmailVerified: minimalUserData.emailVerified,
  points: 1,
  // This is the default value if profileUI is missing. If individual properties
  // are missing from the db, they will be omitted from the response.
  profileUI: lockedProfileUI
};

// The following appears in get-session-user responses, but not
// get-public-profile
const sessionOnlyData = {
  currentChallengeId: testUserData.currentChallengeId,
  email: testUserData.email,
  emailVerified: testUserData.emailVerified,
  isEmailVerified: testUserData.emailVerified,
  sendQuincyEmail: testUserData.sendQuincyEmail,
  theme: testUserData.theme,
  keyboardShortcuts: testUserData.keyboardShortcuts,
  completedChallengeCount: 3,
  acceptedPrivacyTerms: testUserData.acceptedPrivacyTerms
};

const publicUserData = {
  about: testUserData.about,
  calendar: { 1520002973: 1, 1520440323: 1 },
  // testUserData.completedChallenges, with nulls removed
  completedChallenges: [
    {
      id: 'a6b0bb188d873cb2c8729495',
      completedDate: 1520002973119,
      challengeType: 5,
      files: [
        {
          contents: 'test',
          ext: 'js',
          key: 'indexjs',
          name: 'test',
          path: 'path-test'
        },
        {
          contents: 'test2',
          ext: 'html',
          key: 'html-test',
          name: 'test2'
        }
      ]
    },
    {
      id: 'a5229172f011153519423690',
      completedDate: 1520440323273,
      challengeType: 5,
      files: []
    },
    {
      id: 'a5229172f011153519423692',
      completedDate: 1520440323274,
      githubLink: '',
      challengeType: 5,
      files: [],
      examResults: {
        numberOfCorrectAnswers: 0,
        numberOfQuestionsInExam: 0,
        percentCorrect: 0,
        passingPercent: 0,
        passed: false,
        examTimeInSeconds: 0
      }
    }
  ],
  career: [],
  completedExams: testUserData.completedExams,
  completedSurveys: [], // TODO: add surveys
  quizAttempts: testUserData.quizAttempts,
  githubProfile: testUserData.githubProfile,
  is2018DataVisCert: testUserData.is2018DataVisCert,
  is2018FullStackCert: testUserData.is2018FullStackCert, // TODO: should this be returned? The client doesn't use it at the moment.
  isApisMicroservicesCert: testUserData.isApisMicroservicesCert,
  isBackEndCert: testUserData.isBackEndCert,
  isCheater: testUserData.isCheater,
  isCollegeAlgebraPyCertV8: testUserData.isCollegeAlgebraPyCertV8,
  isDataAnalysisPyCertV7: testUserData.isDataAnalysisPyCertV7,
  isDataVisCert: testUserData.isDataVisCert,
  isDonating: testUserData.isDonating,
  isFoundationalCSharpCertV8: testUserData.isFoundationalCSharpCertV8,
  isFrontEndCert: testUserData.isFrontEndCert,
  isFrontEndLibsCert: testUserData.isFrontEndLibsCert,
  isFullStackCert: testUserData.isFullStackCert,
  isHonest: testUserData.isHonest,
  isInfosecCertV7: testUserData.isInfosecCertV7,
  isInfosecQaCert: testUserData.isInfosecQaCert,
  isJsAlgoDataStructCert: testUserData.isJsAlgoDataStructCert,
  isJsAlgoDataStructCertV8: testUserData.isJsAlgoDataStructCertV8,
  isMachineLearningPyCertV7: testUserData.isMachineLearningPyCertV7,
  isQaCertV7: testUserData.isQaCertV7,
  isRelationalDatabaseCertV8: testUserData.isRelationalDatabaseCertV8,
  isRespWebDesignCert: testUserData.isRespWebDesignCert,
  isSciCompPyCertV7: testUserData.isSciCompPyCertV7,
  linkedin: testUserData.linkedin,
  location: testUserData.location,
  name: testUserData.name,
  partiallyCompletedChallenges: [{ id: '123', completedDate: 123 }],
  picture: testUserData.picture,
  points: 2,
  portfolio: testUserData.portfolio,
  profileUI: testUserData.profileUI,
  savedChallenges: testUserData.savedChallenges,
  twitter: 'https://twitter.com/foobar',
  username: testUserData.usernameDisplay, // It defaults to usernameDisplay
  website: testUserData.website,
  yearsTopContributor: testUserData.yearsTopContributor
};

// This is (most of) what we expect to get back from the API. The remaining
// properties are 'id' and 'joinDate', which are generated by the database.
// We're currently filtering properties with null values, since the old api just
// would not return those.
const sessionUserData = {
  ...sessionOnlyData,
  ...publicUserData
};

const baseProgressData = {
  currentChallengeId: '',
  isRespWebDesignCert: false,
  is2018DataVisCert: false,
  isFrontEndLibsCert: false,
  isJsAlgoDataStructCert: false,
  isApisMicroservicesCert: false,
  isInfosecQaCert: false,
  isQaCertV7: false,
  isInfosecCertV7: false,
  is2018FullStackCert: false,
  isFrontEndCert: false,
  isBackEndCert: false,
  isDataVisCert: false,
  isFullStackCert: false,
  isSciCompPyCertV7: false,
  isDataAnalysisPyCertV7: false,
  isMachineLearningPyCertV7: false,
  isRelationalDatabaseCertV8: false,
  isCollegeAlgebraPyCertV8: false,
  completedChallenges: [],
  completedExams: [],
  savedChallenges: [],
  partiallyCompletedChallenges: [],
  needsModeration: false
};

const modifiedProgressData = {
  ...baseProgressData,
  currentChallengeId: 'hello there',
  isRespWebDesignCert: true,
  isJsAlgoDataStructCert: true,
  isRelationalDatabaseCertV8: true,
  needsModeration: true
};

const userTokenId = 'dummy-id';
const otherUserId = 'aaaaaaaaaaaaaaaaaaaaaaaa';

const msUsernameData = [
  { msUsername: 'foobar', userId: defaultUserId, ttl: 123 },
  { msUsername: 'foobar2', userId: defaultUserId, ttl: 123 },
  { msUsername: 'foobar3', userId: otherUserId, ttl: 123 }
];

const tokenData = [
  { created: new Date(), id: '123', ttl: 1000, userId: defaultUserId },
  { created: new Date(), id: '456', ttl: 1000, userId: defaultUserId },
  { created: new Date(), id: '789', ttl: 1000, userId: otherUserId }
];

const mockSurveyResults = {
  title: 'Foundational C# with Microsoft Survey',
  responses: [
    {
      question: 'Please describe your role:',
      response: 'Beginner developer (less than 2 years experience)'
    },
    {
      question:
        'Prior to this course, how experienced were you with .NET and C#?',
      response: 'Novice (no prior experience)'
    }
  ]
};

describe('userRoutes', () => {
  setupServer();

  describe('Authenticated user', () => {
    let superGet: ReturnType<typeof createSuperRequest>;
    let superPost: ReturnType<typeof createSuperRequest>;
    let superDelete: ReturnType<typeof createSuperRequest>;

    beforeEach(async () => {
      const setCookies = await devLogin();
      superGet = createSuperRequest({ method: 'GET', setCookies });
      superPost = createSuperRequest({ method: 'POST', setCookies });
      superDelete = createSuperRequest({ method: 'DELETE', setCookies });
    });

    describe('/account/delete', () => {
      afterEach(async () => {
        await fastifyTestInstance.prisma.userToken.deleteMany({
          where: { OR: [{ userId: defaultUserId }, { userId: otherUserId }] }
        });
        await fastifyTestInstance.prisma.msUsername.deleteMany({
          where: { OR: [{ userId: defaultUserId }, { userId: otherUserId }] }
        });
        await clearEnvExam();
      });

      test('POST returns 200 status code with empty object', async () => {
        expect(await fastifyTestInstance.prisma.user.count()).toBe(1);
        const response = await superPost('/account/delete');
        const userCount = await fastifyTestInstance.prisma.user.count({
          where: { email: testUserData.email }
        });

        expect(response.body).toStrictEqual({});
        expect(response.status).toBe(200);
        expect(userCount).toBe(0);
      });

      test('POST deletes Microsoft usernames associated with the user', async () => {
        await fastifyTestInstance.prisma.msUsername.createMany({
          data: msUsernameData
        });

        await superPost('/account/delete');
        expect(await fastifyTestInstance.prisma.msUsername.count()).toBe(1);
      });

      test('POST deletes userTokens associated with the user', async () => {
        await fastifyTestInstance.prisma.userToken.createMany({
          data: tokenData
        });

        await superPost('/account/delete');

        const userTokens =
          await fastifyTestInstance.prisma.userToken.findMany();
        expect(userTokens).toHaveLength(1);
        expect(userTokens[0]?.userId).toBe(otherUserId);
      });

      test("POST deletes all the user's cookies", async () => {
        const res = await superPost('/account/delete');

        const setCookie = res.headers['set-cookie'];
        expect(setCookie).toEqual(
          expect.arrayContaining([
            expect.stringMatching(
              /^jwt_access_token=; Path=\/; Expires=Thu, 01 Jan 1970 00:00:00 GMT/
            ),
            expect.stringMatching(
              /^csrf_token=; Path=\/; Expires=Thu, 01 Jan 1970 00:00:00 GMT/
            ),
            expect.stringMatching(
              /^_csrf=; Path=\/; Expires=Thu, 01 Jan 1970 00:00:00 GMT/
            )
          ])
        );
        expect(setCookie).toHaveLength(3);
      });

      test("POST deletes all the user's exam attempts", async () => {
        await seedEnvExam();
        await seedEnvExamAttempt();
        const countBefore =
          await fastifyTestInstance.prisma.envExamAttempt.count();
        expect(countBefore).toBe(1);

        const res = await superPost('/account/delete');

        const countAfter =
          await fastifyTestInstance.prisma.envExamAttempt.count();
        expect(countAfter).toBe(0);
        expect(res.status).toBe(200);
      });

      test("POST deletes all the user's exam tokens", async () => {
        await seedExamEnvExamAuthToken();
        const countBefore =
          await fastifyTestInstance.prisma.examEnvironmentAuthorizationToken.count();
        expect(countBefore).toBe(1);

        const res = await superPost('/account/delete');

        const countAfter =
          await fastifyTestInstance.prisma.examEnvironmentAuthorizationToken.count();
        expect(countAfter).toBe(0);
        expect(res.status).toBe(200);
      });
    });

    describe('/account/reset-progress', () => {
      afterEach(async () => {
        await fastifyTestInstance.prisma.userToken.deleteMany({
          where: { OR: [{ userId: defaultUserId }, { userId: otherUserId }] }
        });
        await fastifyTestInstance.prisma.msUsername.deleteMany({
          where: { OR: [{ userId: defaultUserId }, { userId: otherUserId }] }
        });
      });
      test('POST returns 200 status code with empty object', async () => {
        await fastifyTestInstance.prisma.user.updateMany({
          where: { email: testUserData.email },
          data: modifiedProgressData
        });

        const response = await superPost('/account/reset-progress');

        const user = await fastifyTestInstance.prisma.user.findFirst({
          where: { email: testUserData.email }
        });

        expect(response.body).toStrictEqual({});
        expect(response.status).toBe(200);

        expect(user?.progressTimestamps).toHaveLength(1);
        expect(user).toMatchObject(baseProgressData);
      });

      test('POST deletes Microsoft usernames associated with the user', async () => {
        await fastifyTestInstance.prisma.msUsername.createMany({
          data: msUsernameData
        });

        await superPost('/account/reset-progress');

        expect(await fastifyTestInstance.prisma.msUsername.count()).toBe(1);
      });

      test('POST deletes userTokens associated with the user', async () => {
        await fastifyTestInstance.prisma.userToken.createMany({
          data: tokenData
        });

        await superPost('/account/reset-progress');

        const userTokens =
          await fastifyTestInstance.prisma.userToken.findMany();
        expect(userTokens).toHaveLength(1);
        expect(userTokens[0]?.userId).toBe(otherUserId);
      });

      test.todo('POST resets the user to the default state');
    });

    describe('/user/user-token', () => {
      beforeEach(async () => {
        await fastifyTestInstance.prisma.userToken.create({
          data: {
            created: new Date(),
            id: '123',
            ttl: 1000,
            userId: defaultUserId
          }
        });
      });

      afterEach(async () => {
        await fastifyTestInstance.prisma.userToken.deleteMany({
          where: {
            userId: defaultUserId
          }
        });
      });

      // TODO(Post-MVP): consider using PUT and updating the logic to upsert
      test('POST success response includes a JWT encoded string', async () => {
        const response = await superPost('/user/user-token');

        const userToken = response.body.userToken;
        const decodedToken = jwt.decode(userToken);

        expect(response.body).toStrictEqual({ userToken: expect.any(String) });
        expect(decodedToken).toStrictEqual({
          userToken: expect.stringMatching(/^[a-zA-Z0-9]{64}$/),
          iat: expect.any(Number)
        });

        expect(() => jwt.verify(userToken, 'wrong-secret')).toThrow();
        expect(() => jwt.verify(userToken, JWT_SECRET)).not.toThrow();

        // TODO(Post-MVP): consider using 201 for new tokens.
        expect(response.status).toBe(200);
      });

      test('POST responds with an encoded UserToken id', async () => {
        const response = await superPost('/user/user-token');

        const decodedToken = jwt.decode(response.body.userToken);
        const userTokenId = (decodedToken as JwtPayload).userToken;

        // Verify that the token has been created.
        await fastifyTestInstance.prisma.userToken.findUniqueOrThrow({
          where: { id: userTokenId }
        });

        // TODO(Post-MVP): consider using 201 for new tokens.
        expect(response.status).toBe(200);
      });

      test('POST deletes old tokens when creating a new one', async () => {
        const response = await superPost('/user/user-token');

        const decodedToken = jwt.decode(response.body.userToken);
        const userTokenId = (decodedToken as JwtPayload).userToken;

        // Verify that the token has been created.
        await fastifyTestInstance.prisma.userToken.findUniqueOrThrow({
          where: { id: userTokenId }
        });

        await superPost('/user/user-token');

        // Verify that the old token has been deleted.
        expect(
          await fastifyTestInstance.prisma.userToken.findUnique({
            where: { id: userTokenId }
          })
        ).toBeNull();
        expect(await fastifyTestInstance.prisma.userToken.count()).toBe(1);
      });

      test('DELETE returns 200 status with null userToken', async () => {
        const response = await superDelete('/user/user-token');

        expect(response.body).toStrictEqual({ userToken: null });
        expect(response.status).toBe(200);
        expect(await fastifyTestInstance.prisma.userToken.count()).toBe(0);
      });

      test('DELETEing a missing userToken returns 404 status with an error message', async () => {
        await superDelete('/user/user-token');

        const response = await superDelete('/user/user-token');

        expect(response.body).toStrictEqual({
          type: 'info',
          message: 'userToken not found'
        });
        expect(response.status).toBe(404);
      });
    });

    describe('/user/get-user-session', () => {
      beforeEach(async () => {
        await fastifyTestInstance.prisma.user.updateMany({
          where: { email: testUserData.email },
          data: testUserData
        });
      });

      afterEach(async () => {
        await fastifyTestInstance.prisma.userToken.deleteMany({
          where: { id: userTokenId }
        });
        await fastifyTestInstance.prisma.examEnvironmentAuthorizationToken.deleteMany(
          {
            where: { userId: defaultUserId }
          }
        );
      });

      test('GET rejects with 500 status code if the username is missing', async () => {
        await fastifyTestInstance.prisma.user.updateMany({
          where: { email: testUserData.email },
          data: { username: '' }
        });

        const response = await superGet('/user/get-session-user');

        expect(response.body).toStrictEqual({ user: {}, result: '' });
        expect(response.statusCode).toBe(500);
      });

      // This should help debugging, since this the route returns this if
      // anything throws in the handler.
      test('GET does not return the error response if the request is valid', async () => {
        const response = await superGet('/user/get-session-user');

        expect(response.body).not.toEqual({ user: {}, result: '' });
      });

      test('GET returns username as the result property', async () => {
        const response = await superGet('/user/get-session-user');

        expect(response.body).toMatchObject({
          result: testUserData.username
        });
        expect(response.statusCode).toBe(200);
      });

      test('GET returns the public user object', async () => {
        // TODO: This gets the user from the database so that we can verify the
        // joinDate. It feels like there should be a better way to do this.
        const testUser = await fastifyTestInstance?.prisma.user.findFirst({
          where: { email: testUserData.email }
        });
        const publicUser = {
          ...sessionUserData,
          id: testUser?.id,
          joinDate: new ObjectId(testUser?.id).getTimestamp().toISOString()
        };

        const response = await superGet('/user/get-session-user');
        const {
          user: { foobar }
        } = response.body as unknown as {
          user: { foobar: typeof publicUser };
        };

        expect(testUser).not.toBeNull();
        expect(testUser?.id).not.toBeNull();
        expect(foobar).toEqual(publicUser);
      });

      test('GET returns the userToken if it exists', async () => {
        const tokenData = {
          userId: defaultUserId,
          ttl: 123,
          id: userTokenId,
          created: new Date()
        };

        await fastifyTestInstance.prisma.userToken.create({
          data: tokenData
        });

        const tokens = await fastifyTestInstance.prisma.userToken.count();
        expect(tokens).toBe(1);

        const response = await superGet('/user/get-session-user');

        const { userToken } = jwt.decode(
          response.body.user.foobar.userToken
        ) as { userToken: string };

        expect(tokenData.id).toBe(userToken);
      });

      test('GET returns the msUsername if it exists', async () => {
        await fastifyTestInstance.prisma.msUsername.create({
          data: msUsernameData[0] as (typeof msUsernameData)[0]
        });

        const msUsernames = await fastifyTestInstance.prisma.msUsername.count();
        expect(msUsernames).toBe(1);

        const response = await superGet('/user/get-session-user');

        const { msUsername } = response.body.user.foobar;

        expect(msUsername).toBe(msUsernameData[0]?.msUsername);
      });

      test('GET returns a minimal user when all optional properties are missing', async () => {
        // To get a minimal test user we first delete the existing one...
        await fastifyTestInstance.prisma.user.deleteMany({
          where: {
            email: minimalUserData.email
          }
        });
        // ...then recreate it using only the properties that the schema
        // requires. The alternative is to update, but that would require
        // a lot of unsets (this is neater)
        const testUser = await fastifyTestInstance.prisma.user.create({
          data: minimalUserData
        });

        // devLogin must not be used here since it overrides the user
        const res = await superRequest('/signin', { method: 'GET' });
        const setCookies = res.get('Set-Cookie');

        const publicUser = {
          ..._.omit(minimalUserData, ['externalId', 'unsubscribeId']),
          ...computedProperties,
          id: testUser.id,
          joinDate: new ObjectId(testUser.id).getTimestamp().toISOString(),
          // the following properties are defaults provided if the field is
          // missing in the user document.
          currentChallengeId: '',
          completedChallenges: [],
          completedExams: [],
          completedSurveys: [],
          partiallyCompletedChallenges: [],
          portfolio: [],
          career: [],
          savedChallenges: [],
          quizAttempts: [],
          yearsTopContributor: [],
          is2018DataVisCert: false,
          is2018FullStackCert: false,
          isApisMicroservicesCert: false,
          isBackEndCert: false,
          isCheater: false,
          isCollegeAlgebraPyCertV8: false,
          isDataAnalysisPyCertV7: false,
          isDataVisCert: false,
          isFoundationalCSharpCertV8: false,
          isFrontEndCert: false,
          isFrontEndLibsCert: false,
          isFullStackCert: false,
          isHonest: false,
          isInfosecCertV7: false,
          isInfosecQaCert: false,
          isJsAlgoDataStructCert: false,
          isJsAlgoDataStructCertV8: false,
          isMachineLearningPyCertV7: false,
          isQaCertV7: false,
          isRelationalDatabaseCertV8: false,
          isRespWebDesignCert: false,
          isSciCompPyCertV7: false,
          keyboardShortcuts: false,
          location: '',
          name: '',
          theme: 'default'
        };

        const response = await superRequest('/user/get-session-user', {
          method: 'GET',
          setCookies
        });

        const {
          user: { testuser }
        } = response.body as unknown as {
          user: { testuser: typeof publicUser };
        };

        expect(testuser).toStrictEqual(publicUser);
      });
    });

    describe('/user/report-user', () => {
      let sendEmailSpy: jest.SpyInstance;
      beforeEach(() => {
        sendEmailSpy = jest
          .spyOn(fastifyTestInstance, 'sendEmail')
          .mockImplementation(jest.fn());
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      test('POST returns 400 for empty username', async () => {
        const response = await superPost('/user/report-user').send({
          username: '',
          reportDescription: 'Test Report'
        });

        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({
          type: 'danger',
          message: 'flash.provide-username'
        });
      });

      test('POST returns 400 for empty report', async () => {
        const response = await superPost('/user/report-user').send({
          username: 'darth-vader',
          reportDescription: ''
        });

        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({
          type: 'danger',
          message: 'flash.provide-username'
        });
      });

      test('POST sanitises report description', async () => {
        await superPost('/user/report-user').send({
          username: 'darth-vader',
          reportDescription:
            '<script>const breath = "loud"</script>Luke, I am your father'
        });

        expect(sendEmailSpy).toHaveBeenCalledTimes(1);
        expect(sendEmailSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            text: expect.stringContaining(
              'Report Details:\n\nLuke, I am your father'
            )
          })
        );
      });

      test('POST returns 200 status code with "success" message', async () => {
        const testUser = await fastifyTestInstance.prisma.user.findFirstOrThrow(
          {
            where: { email: testUserData.email }
          }
        );
        const response = await superPost('/user/report-user').send({
          username: 'darth-vader',
          reportDescription: 'Luke, I am your father'
        });

        expect(sendEmailSpy).toHaveBeenCalledTimes(1);
        expect(sendEmailSpy).toHaveBeenCalledWith({
          from: 'team@freecodecamp.org',
          to: 'support@freecodecamp.org',
          cc: 'foo@bar.com',
          subject: "Abuse Report : Reporting darth-vader's profile.",
          text: `
Hello Team,

This is to report the profile of darth-vader.

Report Details:

Luke, I am your father


Reported by:
Username: ${testUser.username}
Name:
Email: foo@bar.com

Thanks and regards,
`
        });

        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({
          type: 'info',
          message: 'flash.report-sent',
          variables: { email: 'foo@bar.com' }
        });
      });
    });

    describe('/user/ms-username', () => {
      describe('DELETE', () => {
        afterEach(async () => {
          await fastifyTestInstance.prisma.msUsername.deleteMany({
            where: { userId: otherUserId }
          });
        });

        test('deletes all Microsoft usernames associated with the user', async () => {
          await fastifyTestInstance.prisma.msUsername.createMany({
            data: [
              { msUsername: 'foobar', userId: defaultUserId, ttl: 123 },
              { msUsername: 'foobar2', userId: defaultUserId, ttl: 123 }
            ]
          });

          const response = await superDelete('/user/ms-username');

          const msUsernames =
            await fastifyTestInstance.prisma.msUsername.count();

          expect(msUsernames).toBe(0);
          expect(response.body).toStrictEqual({ msUsername: null });
          expect(response.statusCode).toBe(200);
        });

        test('does not delete Microsoft usernames associated with other users', async () => {
          await fastifyTestInstance.prisma.msUsername.createMany({
            data: [
              { msUsername: 'foobar', userId: otherUserId, ttl: 123 },
              { msUsername: 'foobar2', userId: defaultUserId, ttl: 123 }
            ]
          });

          await superDelete('/user/ms-username');

          const msUsernames =
            await fastifyTestInstance.prisma.msUsername.count();

          expect(msUsernames).toBe(1);
        });
      });

      describe('POST', () => {
        beforeEach(() => {
          mockedFetch.mockClear();
        });
        afterEach(async () => {
          await fastifyTestInstance.prisma.msUsername.deleteMany({
            where: {
              OR: [
                { userId: defaultUserId },
                { userId: 'aaaaaaaaaaaaaaaaaaaaaaaa' }
              ]
            }
          });
        });

        it('handles missing transcript urls', async () => {
          const response = await superPost('/user/ms-username');

          expect(response.body).toStrictEqual({
            type: 'error',
            message: 'flash.ms.transcript.link-err-1'
          });
          expect(response.statusCode).toBe(400);
        });

        it('handles invalid transcript urls', async () => {
          mockedFetch.mockImplementationOnce(() =>
            Promise.resolve({
              ok: false
            })
          );

          const response = await superPost('/user/ms-username').send({
            msTranscriptUrl: 'https://www.example.com'
          });

          expect(response.body).toStrictEqual({
            type: 'error',
            message: 'flash.ms.transcript.link-err-2'
          });
          expect(response.statusCode).toBe(404);
        });

        it('handles the case that MS does not return a username', async () => {
          mockedFetch.mockImplementationOnce(() =>
            Promise.resolve({
              ok: true,
              json: () => Promise.resolve({})
            })
          );

          const response = await superPost('/user/ms-username').send({
            msTranscriptUrl: 'https://www.example.com'
          });

          expect(response.body).toStrictEqual({
            type: 'error',
            message: 'flash.ms.transcript.link-err-3'
          });
          expect(response.statusCode).toBe(500);
        });

        it('handles duplicate Microsoft usernames', async () => {
          mockedFetch.mockImplementationOnce(() =>
            Promise.resolve({
              ok: true,
              json: () =>
                Promise.resolve({
                  userName: 'foobar'
                })
            })
          );

          await fastifyTestInstance.prisma.msUsername.create({
            data: {
              msUsername: 'foobar',
              userId: defaultUserId,
              ttl: 77760000000
            }
          });

          const response = await superPost('/user/ms-username').send({
            msTranscriptUrl: 'https://www.example.com'
          });

          expect(response.body).toStrictEqual({
            type: 'error',
            message: 'flash.ms.transcript.link-err-4'
          });

          expect(response.statusCode).toBe(403);
        });

        it('returns the username on success', async () => {
          const msUsername = 'ms-user';
          mockedFetch.mockImplementationOnce(() =>
            Promise.resolve({
              ok: true,
              json: () =>
                Promise.resolve({
                  userName: msUsername
                })
            })
          );
          const response = await superPost('/user/ms-username').send({
            msTranscriptUrl: 'https://www.example.com'
          });

          expect(response.body).toStrictEqual({
            msUsername
          });
          expect(response.statusCode).toBe(200);
        });

        it('creates a record of the linked account', async () => {
          const msUsername = 'super-user';
          mockedFetch.mockImplementationOnce(() =>
            Promise.resolve({
              ok: true,
              json: () =>
                Promise.resolve({
                  userName: msUsername
                })
            })
          );

          await superPost('/user/ms-username').send({
            msTranscriptUrl: 'https://www.example.com'
          });

          const linkedAccount =
            await fastifyTestInstance.prisma.msUsername.findFirstOrThrow({
              where: { msUsername }
            });

          expect(linkedAccount).toStrictEqual({
            id: expect.stringMatching(/^[a-f\d]{24}$/),
            userId: defaultUserId,
            ttl: 77760000000,
            msUsername
          });
        });

        it('removes any other accounts linked to the same user', async () => {
          const msUsernameOne = 'super-user';
          const msUsernameTwo = 'super-user-2';
          mockedFetch
            .mockImplementationOnce(() =>
              Promise.resolve({
                ok: true,
                json: () =>
                  Promise.resolve({
                    userName: msUsernameOne
                  })
              })
            )
            .mockImplementationOnce(() =>
              Promise.resolve({
                ok: true,
                json: () =>
                  Promise.resolve({
                    userName: msUsernameTwo
                  })
              })
            );

          await fastifyTestInstance.prisma.msUsername.create({
            data: {
              msUsername: 'dummy',
              userId: 'aaaaaaaaaaaaaaaaaaaaaaaa',
              ttl: 77760000000
            }
          });

          await superPost('/user/ms-username').send({
            msTranscriptUrl: 'https://www.example.com'
          });
          await superPost('/user/ms-username').send({
            msTranscriptUrl: 'https://www.example.com'
          });

          const linkedAccounts =
            await fastifyTestInstance.prisma.msUsername.findMany({});

          expect(linkedAccounts).toHaveLength(2);
          expect(linkedAccounts[1]?.msUsername).toBe(msUsernameTwo);
        });

        it('calls the Microsoft API with the correct url', async () => {
          const msTranscriptUrl =
            'https://learn.microsoft.com/en-us/users/mot01/transcript/8u6awert43q1plo';

          const msTranscriptApiUrl =
            'https://learn.microsoft.com/api/profiles/transcript/share/8u6awert43q1plo';

          await superPost('/user/ms-username').send({
            msTranscriptUrl
          });

          expect(mockedFetch).toHaveBeenCalledWith(msTranscriptApiUrl);
        });
      });
    });

    describe('/user/submit-survey', () => {
      afterEach(async () => {
        await fastifyTestInstance.prisma.survey.deleteMany({
          where: { userId: defaultUserId }
        });
      });

      test('POST returns 400 for invalid survey title', async () => {
        const response = await superPost('/user/submit-survey').send({
          surveyResults: { ...mockSurveyResults, title: 'Invalid Survey' }
        });

        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({
          type: 'error',
          message: 'flash.survey.err-1'
        });
      });

      test('POST returns 400 if user already submitted survey', async () => {
        // Submit survey for first time
        await superPost('/user/submit-survey').send({
          surveyResults: mockSurveyResults
        });

        // Submit same survey again to get failed response
        const response = await superPost('/user/submit-survey').send({
          surveyResults: mockSurveyResults
        });

        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({
          type: 'error',
          message: 'flash.survey.err-2'
        });
      });

      test('POST returns 200 status code with "success" message', async () => {
        const response = await superPost('/user/submit-survey').send({
          surveyResults: mockSurveyResults
        });

        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({
          type: 'success',
          message: 'flash.survey.success'
        });
      });
    });

    describe('/user/exam-environment/token', () => {
      afterEach(async () => {
        await fastifyTestInstance.prisma.examEnvironmentAuthorizationToken.deleteMany(
          {
            where: { userId: defaultUserId }
          }
        );
      });

      test('POST generates a new token if one does not exist', async () => {
        const response = await superPost('/user/exam-environment/token');
        const { examEnvironmentAuthorizationToken } = response.body;

        const decodedToken = jwt.decode(examEnvironmentAuthorizationToken);

        expect(decodedToken).toStrictEqual({
          examEnvironmentAuthorizationToken:
            expect.stringMatching(/^[a-z0-9]{24}$/),
          iat: expect.any(Number)
        });

        expect(() =>
          jwt.verify(examEnvironmentAuthorizationToken, 'wrong-secret')
        ).toThrow();
        expect(() =>
          jwt.verify(examEnvironmentAuthorizationToken, JWT_SECRET)
        ).not.toThrow();

        expect(response.status).toBe(201);
      });

      test('POST only allows for one token per user id', async () => {
        const token =
          await fastifyTestInstance.prisma.examEnvironmentAuthorizationToken.create(
            {
              data: {
                userId: defaultUserId,
                expireAt: new Date()
              }
            }
          );

        const response = await superPost('/user/exam-environment/token');

        const { examEnvironmentAuthorizationToken } = response.body;

        const decodedToken = jwt.decode(examEnvironmentAuthorizationToken);

        expect(decodedToken).not.toHaveProperty(
          'examEnvironmentAuthorizationToken',
          token.id
        );

        expect(response.status).toBe(201);

        const tokens =
          await fastifyTestInstance.prisma.examEnvironmentAuthorizationToken.findMany(
            {
              where: { userId: defaultUserId }
            }
          );
        expect(tokens).toHaveLength(1);
      });
    });
  });

  describe('Unauthenticated user', () => {
    let setCookies: string[];
    // Get the CSRF cookies from an unprotected route
    beforeAll(async () => {
      const res = await superRequest('/status/ping', { method: 'GET' });
      setCookies = res.get('Set-Cookie');
    });

    const endpoints: { path: string; method: 'GET' | 'POST' | 'DELETE' }[] = [
      { path: '/account/delete', method: 'POST' },
      { path: '/account/reset-progress', method: 'POST' },
      { path: '/user/get-session-user', method: 'GET' },
      { path: '/user/user-token', method: 'DELETE' },
      { path: '/user/user-token', method: 'POST' },
      { path: '/user/ms-username', method: 'DELETE' },
      { path: '/user/report-user', method: 'POST' },
      { path: '/user/ms-username', method: 'POST' },
      { path: '/user/submit-survey', method: 'POST' }
    ];

    endpoints.forEach(({ path, method }) => {
      test(`${method} ${path} returns 401 status code with error message`, async () => {
        const response = await superRequest(path, {
          method,
          setCookies
        });
        expect(response.statusCode).toBe(401);
      });
    });
  });
});

describe('Microsoft helpers', () => {
  describe('getMsTranscriptApiUrl', () => {
    const expectedUrl =
      'https://learn.microsoft.com/api/profiles/transcript/share/8u6awert43q1plo';

    const urlWithoutSlash =
      'https://learn.microsoft.com/en-us/users/mot01/transcript/8u6awert43q1plo';
    const urlWithSlash = `${urlWithoutSlash}/`;
    const urlWithQueryParams = `${urlWithoutSlash}?foo=bar`;
    const urlWithQueryParamsAndSlash = `${urlWithSlash}?foo=bar`;

    it('should extract the transcript id from the url', () => {
      expect(getMsTranscriptApiUrl(urlWithoutSlash)).toBe(expectedUrl);
    });

    it('should handle trailing slashes', () => {
      expect(getMsTranscriptApiUrl(urlWithSlash)).toBe(expectedUrl);
    });

    it('should ignore query params', () => {
      expect(getMsTranscriptApiUrl(urlWithQueryParams)).toBe(expectedUrl);
      expect(getMsTranscriptApiUrl(urlWithQueryParamsAndSlash)).toBe(
        expectedUrl
      );
    });
  });
});
