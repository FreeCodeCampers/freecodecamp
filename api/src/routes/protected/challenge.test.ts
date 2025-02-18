// Yes, putting this above the imports is a hack to get around the fact that
// jest.mock() must be called at the top level of the file.
const mockVerifyTrophyWithMicrosoft = jest.fn();
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { omit } from 'lodash';
import { Static } from '@fastify/type-provider-typebox';

import { challengeTypes } from '../../../../shared/config/challenge-types';
import {
  defaultUserId,
  devLogin,
  setupServer,
  superRequest,
  seedExam,
  defaultUserEmail,
  createSuperRequest,
  defaultUsername
} from '../../../jest.utils';
import {
  completedExamChallengeOneCorrect,
  completedExamChallengeTwoCorrect,
  completedExamChallengeAllCorrect,
  completedTrophyChallenges,
  examChallengeId,
  mockResultsZeroCorrect,
  mockResultsTwoCorrect,
  mockResultsAllCorrect,
  examWithZeroCorrect,
  examWithOneCorrect,
  examWithTwoCorrect,
  examWithAllCorrect,
  type ExamSubmission
} from '../../../__mocks__/exam';
import { Answer } from '../../utils/exam-types';
import type { getSessionUser } from '../../schemas/user/get-session-user';

const EXISTING_COMPLETED_DATE = new Date('2024-11-08').getTime();
const DATE_NOW = Date.now();

jest.mock('../helpers/challenge-helpers', () => {
  const originalModule = jest.requireActual<
    typeof import('../helpers/challenge-helpers')
  >('../helpers/challenge-helpers');

  return {
    __esModule: true,
    ...originalModule,
    verifyTrophyWithMicrosoft: mockVerifyTrophyWithMicrosoft
  };
});

const isValidChallengeCompletionErrorMsg = {
  type: 'error',
  message: 'That does not appear to be a valid challenge submission.'
};

// /project-completed
const id1 = 'bd7123c8c441eddfaeb5bdef';
const id2 = 'bd7123c8c441eddfaeb5bdec';

const codeallyProject = {
  id: id1,
  challengeType: challengeTypes.codeAllyCert,
  solution: 'https://any.valid/url'
};
const backendProject = {
  id: id2,
  challengeType: challengeTypes.backEndProject,
  solution: 'https://any.valid/url',
  githubLink: 'https://github.com/anything/valid/'
};
const partialCompletion = { id: id1, completedDate: 1 };

// /backend-challenge-completed
const backendChallengeId1 = '587d7fb1367417b2b2512bf4';
const backendChallengeId2 = '587d7fb2367417b2b2512bf8';

const backendChallengeBody1 = {
  id: backendChallengeId1
};
const backendChallengeBody2 = {
  id: backendChallengeId2
};

// /modern-challenge-completed
const HtmlChallengeId = '5dc174fcf86c76b9248c6eb2';
const JsProjectId = '56533eb9ac21ba0edf2244e2';
const multiFileCertProjectId = 'bd7158d8c242eddfaeb5bd13';

const HtmlChallengeBody = {
  challengeType: challengeTypes.html,
  id: HtmlChallengeId
};
const JsProjectBody = {
  challengeType: challengeTypes.jsProject,
  id: JsProjectId,
  files: [
    {
      contents: 'console.log("Hello There!")',
      key: 'scriptjs',
      ext: 'js',
      name: 'script',
      history: ['script.js']
    }
  ]
};
const multiFileCertProjectBody = {
  challengeType: challengeTypes.multifileCertProject,
  id: multiFileCertProjectId,
  files: [
    {
      contents: '<h1>Multi File Project v1</h1>',
      key: 'indexhtml',
      ext: 'html',
      name: 'index',
      history: ['index.html']
    },
    {
      contents: '.hello-there { general: kenobi; }',
      key: 'stylescss',
      ext: 'css',
      name: 'styles',
      history: ['styles.css']
    }
  ]
};
const updatedMultiFileCertProjectBody = {
  challengeType: challengeTypes.multifileCertProject,
  id: multiFileCertProjectId,
  files: [
    {
      contents: '<h1>Multi File Project v2</h1>',
      key: 'indexhtml',
      ext: 'html',
      name: 'index',
      history: ['index.html']
    },
    {
      contents: '.wibbly-wobbly { timey: wimey; }',
      key: 'stylescss',
      ext: 'css',
      name: 'styles',
      history: ['styles.css']
    }
  ]
};

describe('challengeRoutes', () => {
  setupServer();
  describe('Authenticated user', () => {
    let setCookies: string[];
    let superPost: ReturnType<typeof createSuperRequest>;
    let superGet: ReturnType<typeof createSuperRequest>;

    // Authenticate user
    beforeAll(async () => {
      setCookies = await devLogin();
      superPost = createSuperRequest({ method: 'POST', setCookies });
      superGet = createSuperRequest({ method: 'GET', setCookies });
      await seedExam();
    });

    beforeAll(() => {
      jest.useFakeTimers({
        doNotFake: ['nextTick']
      });
      jest.setSystemTime(DATE_NOW);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    describe('POST /coderoad-challenge-completed', () => {
      test('should return 400 if no tutorialId', async () => {
        const response = await superPost('/coderoad-challenge-completed');
        expect(response.body).toEqual({
          msg: `'tutorialId' not found in request body`,
          type: 'error'
        });
        expect(response.status).toBe(400);
      });

      test('should return 400 if no user token', async () => {
        const response = await superPost('/coderoad-challenge-completed').send({
          tutorialId: 'freeCodeCamp/learn-bash-by-building-a-boilerplate:v1.0.0'
        });
        expect(response.body).toEqual({
          msg: `'Coderoad-User-Token' not found in request headers`,
          type: 'error'
        });
        expect(response.status).toBe(400);
      });

      test('should return 400 if invalid user token', async () => {
        const response = await superPost('/coderoad-challenge-completed')
          .set('coderoad-user-token', 'invalid')
          .send({
            tutorialId:
              'freeCodeCamp/learn-bash-by-building-a-boilerplate:v1.0.0'
          });
        expect(response.body).toEqual({
          msg: 'invalid user token',
          type: 'error'
        });
        expect(response.status).toBe(400);
      });

      test('should return 400 if invalid tutorialId', async () => {
        const tokenResponse = await superPost('/user/user-token');
        expect(tokenResponse.body).toHaveProperty('userToken');
        expect(tokenResponse.status).toBe(200);

        const token = (tokenResponse.body as { userToken: string }).userToken;

        const response = await superPost('/coderoad-challenge-completed')
          .set('coderoad-user-token', token)
          .send({ tutorialId: 'invalid' });

        expect(response.body).toEqual({
          msg: 'Tutorial not hosted on freeCodeCamp GitHub account',
          type: 'error'
        });
        expect(response.status).toBe(400);
      });

      test('should return 400 if invalid tutorialId but is hosted on freeCodeCamp', async () => {
        const tokenResponse = await superPost('/user/user-token');
        expect(tokenResponse.body).toHaveProperty('userToken');
        expect(tokenResponse.status).toBe(200);

        const token = (tokenResponse.body as { userToken: string }).userToken;

        const response = await superPost('/coderoad-challenge-completed')
          .set('coderoad-user-token', token)
          .send({ tutorialId: 'freeCodeCamp/invalid:V1.0.0' });

        expect(response.body).toEqual({
          msg: 'Tutorial name is not valid',
          type: 'error'
        });
        expect(response.status).toBe(400);
      });

      test('Should complete challenge with code 200', async () => {
        const tokenResponse = await superPost('/user/user-token');
        expect(tokenResponse.body).toHaveProperty('userToken');
        expect(tokenResponse.status).toBe(200);

        const token = (tokenResponse.body as { userToken: string }).userToken;

        const response = await superPost('/coderoad-challenge-completed')
          .set('coderoad-user-token', token)
          .send({
            tutorialId:
              'freeCodeCamp/learn-bash-by-building-a-boilerplate:v1.0.0'
          });

        expect(response.body).toEqual({
          msg: 'Successfully submitted challenge',
          type: 'success'
        });

        const user = await fastifyTestInstance.prisma.user.findFirst({
          where: { email: 'foo@bar.com' }
        });

        const challengeCompleted = user?.completedChallenges.some(challenge => {
          return challenge.id === '5ea8adfab628f68d805bfc5e';
        });

        expect(challengeCompleted).toBe(true);
        expect(response.status).toBe(200);
      });

      test('Should complete project with code 200', async () => {
        const tokenResponse = await superPost('/user/user-token');
        expect(tokenResponse.body).toHaveProperty('userToken');
        expect(tokenResponse.status).toBe(200);

        const token = (tokenResponse.body as { userToken: string }).userToken;

        const response = await superPost('/coderoad-challenge-completed')
          .set('coderoad-user-token', token)
          .send({
            tutorialId: 'freeCodeCamp/learn-celestial-bodies-database:v1.0.0'
          });

        const user = await fastifyTestInstance.prisma.user.findFirst({
          where: { email: 'foo@bar.com' }
        });

        const projectCompleted = user?.partiallyCompletedChallenges.some(
          project => {
            return project.id === '5f1a4ef5d5d6b5ab580fc6ae';
          }
        );

        expect(projectCompleted).toBe(true);
        expect(response.status).toBe(200);
      });

      afterAll(async () => {
        await fastifyTestInstance.prisma.user.updateMany({
          where: { email: 'foo@bar.com' },
          data: {
            completedChallenges: [],
            progressTimestamps: []
          }
        });
      });
    });
    describe('/project-completed', () => {
      describe('validation', () => {
        it('POST rejects requests without ids', async () => {
          const response = await superPost('/project-completed').send({});

          expect(response.body).toStrictEqual(
            isValidChallengeCompletionErrorMsg
          );
          expect(response.statusCode).toBe(400);
        });

        it('POST rejects requests without valid ObjectIDs', async () => {
          const response = await superPost(
            '/project-completed'
            // This is a departure from api-server, which does not require a
            // solution to give this error. However, the validator will reject
            // based on the missing solution before it gets to the invalid id.
          ).send({ id: 'not-a-valid-id', solution: '' });

          expect(response.body).toStrictEqual(
            isValidChallengeCompletionErrorMsg
          );
          expect(response.statusCode).toBe(400);
        });

        it('POST rejects requests with invalid challengeTypes', async () => {
          const response = await superPost('/project-completed').send({
            id: id1,
            challengeType: 'not-a-valid-challenge-type',
            // TODO(Post-MVP): drop these comments, since the api-server will not
            // exist.

            // a solution is required, because otherwise the request will be
            // rejected before it gets to the challengeType validation. NOTE: this
            // is a departure from the api-server, but only in the message sent.
            solution: ''
          });

          expect(response.body).toStrictEqual(
            isValidChallengeCompletionErrorMsg
          );
          expect(response.statusCode).toBe(400);
        });

        it('POST rejects requests without solutions', async () => {
          const response = await superPost('/project-completed').send({
            id: id1,
            challengeType: 3
          });

          expect(response.body).toStrictEqual({
            type: 'error',
            message:
              'You have not provided the valid links for us to inspect your work.'
          });
          expect(response.statusCode).toBe(400);
        });

        it('POST rejects requests with solutions that are not urls', async () => {
          const response = await superPost('/project-completed').send({
            id: id1,
            challengeType: 3,
            solution: 'not-a-valid-solution'
          });

          expect(response.body).toStrictEqual(
            isValidChallengeCompletionErrorMsg
          );
          expect(response.statusCode).toBe(403);
        });

        it('POST rejects backendProject requests without URL githubLinks', async () => {
          const response = await superPost('/project-completed').send({
            id: id1,
            challengeType: challengeTypes.backEndProject,
            // Solution is allowed to be localhost for backEndProject
            solution: 'http://localhost:3000'
          });

          expect(response.body).toStrictEqual(
            isValidChallengeCompletionErrorMsg
          );
          expect(response.statusCode).toBe(403);

          const response_2 = await superPost('/project-completed').send({
            id: id1,
            challengeType: challengeTypes.backEndProject,
            solution: 'http://localhost:3000',
            githubLink: 'not-a-valid-url'
          });

          expect(response_2.body).toStrictEqual(
            isValidChallengeCompletionErrorMsg
          );
          expect(response_2.statusCode).toBe(403);
        });

        it('POST rejects CodeRoad/CodeAlly projects when the user has not completed the required challenges', async () => {
          const response = await superPost('/project-completed').send({
            id: id1, // not a codeally challenge id, but does not matter
            challengeType: 13, // this does matter, however, since there's special logic for that challenge type
            solution: 'https://any.valid/url'
          });

          expect(response.body).toStrictEqual({
            type: 'error',
            message:
              'You have to complete the project before you can submit a URL.'
          });
          // It's not really a bad request, since the client is sending a valid
          // body. It's just that the user is not allowed to do this - hence 403.
          expect(response.statusCode).toBe(403);
        });
      });

      describe('handling', () => {
        beforeEach(async () => {
          // setup: complete the challenges that codeally projects require
          await fastifyTestInstance.prisma.user.updateMany({
            where: { email: 'foo@bar.com' },
            data: {
              partiallyCompletedChallenges: [{ id: id1, completedDate: 1 }]
            }
          });
        });

        afterEach(async () => {
          await fastifyTestInstance.prisma.user.updateMany({
            where: { email: 'foo@bar.com' },
            data: {
              partiallyCompletedChallenges: [],
              completedChallenges: [],
              savedChallenges: [],
              progressTimestamps: []
            }
          });
        });

        it('POST accepts CodeRoad/CodeAlly projects when the user has completed the required challenges', async () => {
          const response =
            await superPost('/project-completed').send(codeallyProject);

          const user = await fastifyTestInstance.prisma.user.findFirst({
            where: { email: 'foo@bar.com' }
          });

          expect(user).toMatchObject({
            partiallyCompletedChallenges: [],
            completedChallenges: [
              {
                ...codeallyProject,
                completedDate: DATE_NOW
              }
            ]
          });

          const completedDate = user?.completedChallenges[0]?.completedDate;

          expect(completedDate).toEqual(DATE_NOW);

          expect(response.body).toStrictEqual({
            alreadyCompleted: false,
            points: 1,
            completedDate
          });

          expect(response.statusCode).toBe(200);
        });

        it('POST accepts backend projects', async () => {
          const response =
            await superPost('/project-completed').send(backendProject);

          const user = await fastifyTestInstance.prisma.user.findFirst({
            where: { email: 'foo@bar.com' }
          });

          expect(user).toMatchObject({
            partiallyCompletedChallenges: [partialCompletion],
            completedChallenges: [
              {
                ...backendProject,
                completedDate: DATE_NOW
              }
            ]
          });

          const completedDate = user?.completedChallenges[0]?.completedDate;

          expect(completedDate).toEqual(DATE_NOW);

          expect(response.body).toStrictEqual({
            alreadyCompleted: false,
            points: 1,
            completedDate
          });

          expect(response.statusCode).toBe(200);
        });

        it('POST correctly handles multiple requests', async () => {
          const resOriginal =
            await superPost('/project-completed').send(codeallyProject);

          const resBackend =
            await superPost('/project-completed').send(backendProject);

          // sending backendProject again should update its solution, but not
          // progressTimestamps or its completedDate

          const resUpdate = await superPost('/project-completed').send({
            ...codeallyProject,
            solution: 'https://any.other/url'
          });

          const user = await fastifyTestInstance.prisma.user.findFirst({
            where: { email: 'foo@bar.com' }
          });

          const expectedProgressTimestamps = user?.completedChallenges.map(
            challenge => challenge.completedDate
          );

          expect(user).toMatchObject({
            completedChallenges: [
              {
                ...codeallyProject,
                solution: 'https://any.other/url',
                completedDate: resOriginal.body.completedDate
              },
              {
                ...backendProject,
                completedDate: resBackend.body.completedDate
              }
            ],
            progressTimestamps: expectedProgressTimestamps
          });

          expect(resUpdate.body).toStrictEqual({
            alreadyCompleted: true,
            points: 2,
            completedDate: DATE_NOW
          });

          // If a challenge has already been completed, it should return the
          // original completedDate
          expect(resUpdate.body.completedDate).toBe(
            resOriginal.body.completedDate
          );
          expect(resUpdate.statusCode).toBe(200);
        });
      });
    });

    describe('/backend-challenge-completed', () => {
      afterEach(() => {
        // Some tests in the suite override the system time to mimic time passed.
        // Restore system time so that other tests are not affected.
        jest.setSystemTime(DATE_NOW);
      });

      describe('validation', () => {
        test('POST rejects requests without ids', async () => {
          const response = await superPost('/backend-challenge-completed');

          expect(response.body).toStrictEqual(
            isValidChallengeCompletionErrorMsg
          );
          expect(response.statusCode).toBe(400);
        });

        test('POST rejects requests without valid ObjectIDs', async () => {
          const response = await superPost('/backend-challenge-completed').send(
            { id: 'not-a-valid-id', solution: '' }
          );

          expect(response.body).toStrictEqual(
            isValidChallengeCompletionErrorMsg
          );
          expect(response.statusCode).toBe(400);
        });
      });

      describe('handling', () => {
        afterEach(async () => {
          await fastifyTestInstance.prisma.user.updateMany({
            where: { email: 'foo@bar.com' },
            data: {
              completedChallenges: [],
              progressTimestamps: []
            }
          });
        });

        test('POST accepts backend challenges', async () => {
          const response = await superPost('/backend-challenge-completed').send(
            backendChallengeBody1
          );

          const user = await fastifyTestInstance.prisma.user.findFirst({
            where: { email: 'foo@bar.com' }
          });

          expect(user).toMatchObject({
            completedChallenges: [
              {
                ...backendChallengeBody1,
                completedDate: DATE_NOW
              }
            ]
          });

          const completedDate = user?.completedChallenges[0]?.completedDate;
          expect(completedDate).toEqual(DATE_NOW);

          expect(response.body).toStrictEqual({
            alreadyCompleted: false,
            points: 1,
            completedDate
          });
          expect(response.statusCode).toBe(200);
        });

        test('POST correctly handles multiple requests', async () => {
          const updateAt = DATE_NOW + 1000;

          const resOriginal = await superPost(
            '/backend-challenge-completed'
          ).send(backendChallengeBody1);

          await superPost('/backend-challenge-completed').send(
            backendChallengeBody2
          );

          // Mimic the time passed when the second request is made
          jest.advanceTimersByTime(1000);

          const resUpdated = await superPost(
            '/backend-challenge-completed'
          ).send({
            ...backendChallengeBody1
          });

          const user = await fastifyTestInstance.prisma.user.findFirst({
            where: { email: 'foo@bar.com' }
          });

          const expectedProgressTimestamps = user?.completedChallenges.map(
            challenge => challenge.completedDate
          );

          expect(user).toMatchObject({
            completedChallenges: [
              {
                ...backendChallengeBody1,
                completedDate: DATE_NOW
              },
              {
                ...backendChallengeBody2,
                completedDate: DATE_NOW
              }
            ],
            progressTimestamps: expectedProgressTimestamps
          });

          // The original and updated `completedDate` values don't match because of an existing bug.
          // Ref: https://github.com/freeCodeCamp/freeCodeCamp/issues/57972
          expect(resOriginal.body.completedDate).toEqual(DATE_NOW);
          expect(resUpdated.body.completedDate).toEqual(updateAt);
          expect(resUpdated.body).toStrictEqual({
            alreadyCompleted: true,
            points: 2,
            completedDate: updateAt
          });
          expect(resUpdated.statusCode).toBe(200);
        });
      });
    });

    describe('/modern-challenge-completed', () => {
      describe('validation', () => {
        test('POST rejects requests without ids', async () => {
          const response = await superPost('/modern-challenge-completed');

          expect(response.body).toStrictEqual(
            isValidChallengeCompletionErrorMsg
          );
          expect(response.statusCode).toBe(400);
        });

        test('POST rejects requests without valid ObjectIDs', async () => {
          const response = await superPost('/modern-challenge-completed').send({
            id: 'not-a-valid-id'
          });

          expect(response.body).toStrictEqual(
            isValidChallengeCompletionErrorMsg
          );
          expect(response.statusCode).toBe(400);
        });
      });

      describe('handling', () => {
        afterEach(async () => {
          await fastifyTestInstance.prisma.user.updateMany({
            where: { email: 'foo@bar.com' },
            data: {
              completedChallenges: [],
              savedChallenges: [],
              progressTimestamps: []
            }
          });

          // Some tests in the suite override the system time to mimic time passed.
          // Restore system time so that other tests are not affected.
          jest.setSystemTime(DATE_NOW);
        });

        // HTML(0), JS(1), Modern(6), Video(11), The Odin Project(15)
        test('POST accepts challenges without files present', async () => {
          const response = await superPost('/modern-challenge-completed').send(
            HtmlChallengeBody
          );

          const user = await fastifyTestInstance.prisma.user.findFirstOrThrow({
            where: { email: 'foo@bar.com' }
          });

          expect(user).toMatchObject({
            completedChallenges: [
              {
                id: HtmlChallengeId,
                completedDate: DATE_NOW
              }
            ]
          });

          const completedDate = user.completedChallenges[0]?.completedDate;
          expect(completedDate).toEqual(DATE_NOW);

          expect(response.statusCode).toBe(200);
          expect(response.body).toStrictEqual({
            alreadyCompleted: false,
            points: 1,
            completedDate,
            savedChallenges: []
          });
        });

        // JS Project(5), Multi-file Cert Project(14)
        test('POST accepts challenges with files present', async () => {
          const response = await superPost('/modern-challenge-completed').send(
            JsProjectBody
          );

          const user = await fastifyTestInstance.prisma.user.findFirstOrThrow({
            where: { email: 'foo@bar.com' }
          });

          const file = omit(JsProjectBody.files[0], 'history');

          expect(user).toMatchObject({
            completedChallenges: [
              {
                id: JsProjectId,
                challengeType: JsProjectBody.challengeType,
                files: [file],
                completedDate: DATE_NOW
              }
            ]
          });

          const completedDate = user.completedChallenges[0]?.completedDate;
          expect(completedDate).toEqual(DATE_NOW);

          expect(response.body).toStrictEqual({
            alreadyCompleted: false,
            points: 1,
            completedDate,
            savedChallenges: []
          });
          expect(response.statusCode).toBe(200);
        });

        test('POST accepts challenges with saved solutions', async () => {
          const response = await superPost('/modern-challenge-completed').send(
            multiFileCertProjectBody
          );

          const user = await fastifyTestInstance.prisma.user.findFirstOrThrow({
            where: { email: 'foo@bar.com' }
          });

          const testFiles = multiFileCertProjectBody.files.map(
            ({ history: _history, ...rest }) => rest
          );

          expect(user).toMatchObject({
            needsModeration: true,
            completedChallenges: [
              {
                id: multiFileCertProjectId,
                challengeType: multiFileCertProjectBody.challengeType,
                files: testFiles,
                completedDate: DATE_NOW,
                isManuallyApproved: false
              }
            ],
            savedChallenges: [
              {
                id: multiFileCertProjectId,
                lastSavedDate: expect.any(Number),
                files: multiFileCertProjectBody.files
              }
            ]
          });

          const completedDate = user.completedChallenges[0]?.completedDate;
          expect(completedDate).toEqual(DATE_NOW);

          expect(response.body).toStrictEqual({
            alreadyCompleted: false,
            points: 1,
            completedDate,
            savedChallenges: [
              {
                id: multiFileCertProjectId,
                lastSavedDate: completedDate,
                files: multiFileCertProjectBody.files
              }
            ]
          });
          expect(response.statusCode).toBe(200);
        });

        test('POST correctly handles multiple requests', async () => {
          const updateAt = DATE_NOW + 1000;

          const resOriginal = await superPost(
            '/modern-challenge-completed'
          ).send(multiFileCertProjectBody);

          await superPost('/modern-challenge-completed').send(
            HtmlChallengeBody
          );

          // Mimic the time passed when the second request is made
          jest.advanceTimersByTime(1000);

          const resUpdate = await superPost('/modern-challenge-completed').send(
            updatedMultiFileCertProjectBody
          );

          const user = await fastifyTestInstance.prisma.user.findFirstOrThrow({
            where: { email: 'foo@bar.com' }
          });

          const expectedProgressTimestamps = user.completedChallenges.map(
            challenge => challenge.completedDate
          );

          const testFiles = updatedMultiFileCertProjectBody.files.map(file =>
            omit(file, 'history')
          );

          expect(user).toMatchObject({
            needsModeration: true,
            completedChallenges: [
              {
                id: multiFileCertProjectId,
                challengeType: updatedMultiFileCertProjectBody.challengeType,
                files: testFiles,
                completedDate: DATE_NOW,
                isManuallyApproved: false
              },
              {
                id: HtmlChallengeId,
                completedDate: DATE_NOW
              }
            ],
            savedChallenges: [
              {
                id: multiFileCertProjectId,
                lastSavedDate: updateAt,
                files: updatedMultiFileCertProjectBody.files
              }
            ],
            progressTimestamps: expectedProgressTimestamps
          });

          // The original and updated `completedDate` values don't match because of an existing bug.
          // Ref: https://github.com/freeCodeCamp/freeCodeCamp/issues/57972
          expect(resOriginal.body.savedChallenges[0].lastSavedDate).toEqual(
            DATE_NOW
          );
          expect(resUpdate.body.savedChallenges[0].lastSavedDate).toEqual(
            updateAt
          );

          expect(resUpdate.body).toStrictEqual({
            alreadyCompleted: true,
            points: 2,
            completedDate: updateAt,
            savedChallenges: [
              {
                id: multiFileCertProjectId,
                lastSavedDate: updateAt,
                files: updatedMultiFileCertProjectBody.files
              }
            ]
          });
          expect(resUpdate.statusCode).toBe(200);
        });
      });
    });

    describe('POST /save-challenge', () => {
      describe('validation', () => {
        test('returns 400 status for unsavable challenges', async () => {
          const response = await superPost('/save-challenge').send({
            savedChallenges: {
              // valid mongo id, but not a saveable one
              id: 'aaaaaaaaaaaaaaaaaaaaaaa',
              files: multiFileCertProjectBody.files
            }
          });

          expect(response.body).toEqual({
            message: 'That does not appear to be a valid challenge submission.',
            type: 'error'
          });
          expect(response.statusCode).toBe(400);
        });
      });

      describe('handling', () => {
        afterEach(async () => {
          await fastifyTestInstance.prisma.user.updateMany({
            where: { email: 'foo@bar.com' },
            data: {
              savedChallenges: []
            }
          });
        });

        test('rejects requests for challenges that cannot be saved', async () => {
          const response = await superPost('/save-challenge').send({
            id: '66ebd4ae2812430bb883c786',
            files: multiFileCertProjectBody.files
          });

          const { savedChallenges } =
            await fastifyTestInstance.prisma.user.findFirstOrThrow({
              where: { email: 'foo@bar.com' }
            });

          expect(response.statusCode).toBe(400);
          expect(response.text).toEqual('That challenge type is not saveable.');
          expect(savedChallenges).toHaveLength(0);
        });

        test('update the user savedchallenges and return them', async () => {
          const response = await superPost('/save-challenge').send({
            id: multiFileCertProjectId,
            files: updatedMultiFileCertProjectBody.files
          });

          const user = await fastifyTestInstance.prisma.user.findFirstOrThrow({
            where: { email: 'foo@bar.com' }
          });

          const savedDate = user.savedChallenges[0]?.lastSavedDate;

          expect(user).toMatchObject({
            savedChallenges: [
              {
                id: multiFileCertProjectId,
                lastSavedDate: savedDate,
                files: updatedMultiFileCertProjectBody.files
              }
            ]
          });
          expect(response.body).toEqual({
            savedChallenges: [
              {
                id: multiFileCertProjectId,
                lastSavedDate: savedDate,
                files: updatedMultiFileCertProjectBody.files
              }
            ]
          });
          expect(response.statusCode).toBe(200);
        });
      });
    });

    describe('GET /exam/:id', () => {
      beforeAll(async () => {
        await seedExam();
      });

      describe('validation', () => {
        test('GET rejects requests without id param', async () => {
          const response = await superGet('/exam/');

          expect(response.body).toStrictEqual({
            error: `Valid 'id' not found in request parameters.`
          });
          expect(response.statusCode).toBe(400);
        });

        test('GET rejects requests when id param is not a 24-character string', async () => {
          const response = await superGet('/exam/fake-id');

          expect(response.body).toStrictEqual({
            error: `Valid 'id' not found in request parameters.`
          });
          expect(response.statusCode).toBe(400);
        });

        test('GET rejects requests with non-existent id param', async () => {
          const response = await superGet('/exam/123412341234123412341234');

          expect(response.body).toStrictEqual({
            error: 'An error occurred trying to get the exam from the database.'
          });
          expect(response.statusCode).toBe(500);
        });

        test('GET rejects requests where camper has not completed prerequisites', async () => {
          const response = await superGet('/exam/647e22d18acb466c97ccbef8');

          expect(response.body).toStrictEqual({
            error: `You have not completed the required challenges to start the 'Exam Certification'.`
          });
          expect(response.statusCode).toBe(403);
        });
      });

      describe('handling', () => {
        test('GET returns a generatedExam array with the correct objects', async () => {
          await fastifyTestInstance.prisma.user.updateMany({
            where: { email: defaultUserEmail },
            data: { completedChallenges: completedTrophyChallenges }
          });

          const response = await superGet('/exam/647e22d18acb466c97ccbef8');

          expect(response.body).toHaveProperty('generatedExam');

          const { generatedExam } = response.body;

          expect(Array.isArray(generatedExam)).toBe(true);
          expect(generatedExam).toHaveLength(3);

          expect(generatedExam[0]).toHaveProperty('question');
          expect(typeof generatedExam[0].question).toBe('string');

          expect(generatedExam[0]).toHaveProperty('id');
          expect(typeof generatedExam[0].id).toBe('string');

          expect(generatedExam[0]).toHaveProperty('answers');
          expect(Array.isArray(generatedExam[0].answers)).toBe(true);
          expect(generatedExam[0].answers).toHaveLength(5);

          const answers = generatedExam[0].answers as Answer[];

          answers.forEach(a => {
            expect(a).toHaveProperty('answer');
            expect(typeof a.answer).toBe('string');
            expect(a).toHaveProperty('id');
            expect(typeof a.id).toBe('string');
          });

          expect(response.statusCode).toBe(200);
        });
      });
      describe('/ms-trophy-challenge-completed', () => {
        const msUserId = 'abc123';
        // Add Logic to C# Console Applications's id:
        const trophyChallengeId = '647f882207d29547b3bee1c0';
        // Create and Run Simple C# Console Applications's id:
        const trophyChallengeId2 = '647f87dc07d29547b3bee1bf';
        const nonTrophyChallengeId = 'bd7123c8c441eddfaeb5bdef';
        const solutionUrl = `https://learn.microsoft.com/api/achievements/user/${msUserId}`;

        const idIsMissingOrInvalid = {
          type: 'error',
          message: 'flash.ms.trophy.err-2'
        } as const;
        const userHasNotLinkedTheirAccount = {
          type: 'error',
          message: 'flash.ms.trophy.err-1'
        } as const;
        const unexpectedError = {
          type: 'error',
          message: 'flash.ms.trophy.err-5'
        } as const;

        describe('validation', () => {
          test('POST rejects requests without valid ids', async () => {
            const resNoId = await superPost('/ms-trophy-challenge-completed');

            expect(resNoId.body).toStrictEqual(idIsMissingOrInvalid);
            expect(resNoId.statusCode).toBe(400);

            const resBadId = await superPost(
              '/ms-trophy-challenge-completed'
            ).send({ id: nonTrophyChallengeId });

            expect(resBadId.body).toStrictEqual(idIsMissingOrInvalid);
            expect(resBadId.statusCode).toBe(400);
          });

          // TODO(Post-MVP): give a more specific error message
          test('POST rejects requests without valid ObjectIDs', async () => {
            const response = await superPost(
              '/ms-trophy-challenge-completed'
            ).send({ id: 'not-a-valid-id' });

            expect(response.body).toStrictEqual(idIsMissingOrInvalid);
            expect(response.statusCode).toBe(400);
          });
        });

        describe('handling', () => {
          async function createMSUsernameRecord(msUsername: string) {
            await fastifyTestInstance.prisma.msUsername.create({
              data: {
                msUsername,
                ttl: 123,
                userId: defaultUserId
              }
            });
          }

          afterEach(async () => {
            await fastifyTestInstance.prisma.msUsername.deleteMany({
              where: { userId: defaultUserId }
            });
            await fastifyTestInstance.prisma.user.updateMany({
              where: { id: defaultUserId },
              data: {
                completedChallenges: [],
                progressTimestamps: []
              }
            });
          });

          test('POST rejects requests if the user does not have a Microsoft username', async () => {
            const res = await superPost('/ms-trophy-challenge-completed').send({
              id: trophyChallengeId
            });

            expect(res.body).toStrictEqual(userHasNotLinkedTheirAccount);
            expect(res.statusCode).toBe(403);
          });

          test("POST rejects requests if Microsoft's api responds with an error", async () => {
            const msUsername = 'ANRandom';
            await createMSUsernameRecord(msUsername);
            // This can be any error that the route can serialize. Other than
            // that, the details do not matter, since whatever
            // verifyTrophyWithMicrosoft returns will be returned by the route.
            const verifyError = {
              type: 'error',
              message: 'flash.ms.profile.err',
              variables: {
                msUsername
              }
            };
            mockVerifyTrophyWithMicrosoft.mockImplementationOnce(() =>
              Promise.resolve(verifyError)
            );

            const res = await superPost('/ms-trophy-challenge-completed').send({
              id: trophyChallengeId
            });

            expect(res.body).toStrictEqual(verifyError);
            expect(res.statusCode).toBe(403);
          });

          test('POST handles unexpected errors', async () => {
            mockVerifyTrophyWithMicrosoft.mockImplementationOnce(() => {
              throw new Error('Network error');
            });
            const msUsername = 'ANRandom';
            await createMSUsernameRecord(msUsername);

            const res = await superPost('/ms-trophy-challenge-completed').send({
              id: trophyChallengeId
            });

            expect(res.body).toStrictEqual(unexpectedError);
            expect(res.statusCode).toBe(500);
          });

          test('POST updates the user record with a new completed challenge', async () => {
            mockVerifyTrophyWithMicrosoft.mockImplementationOnce(() =>
              Promise.resolve({
                type: 'success',
                msUserAchievementsApiUrl: solutionUrl
              })
            );
            const msUsername = 'ANRandom';
            await createMSUsernameRecord(msUsername);

            const res = await superPost('/ms-trophy-challenge-completed').send({
              id: trophyChallengeId
            });

            const user =
              await fastifyTestInstance.prisma.user.findUniqueOrThrow({
                where: { id: defaultUserId }
              });
            const completedDate = user.completedChallenges[0]?.completedDate;

            expect(res.body).toStrictEqual({
              alreadyCompleted: false,
              points: 1,
              completedDate
            });

            expect(completedDate).toEqual(DATE_NOW);
            expect(res.statusCode).toBe(200);

            expect(user).toMatchObject({
              completedChallenges: [
                {
                  id: trophyChallengeId,
                  solution: solutionUrl,
                  completedDate: DATE_NOW
                }
              ]
            });
          });

          it('POST correctly handles multiple requests', async () => {
            mockVerifyTrophyWithMicrosoft.mockImplementationOnce(() =>
              Promise.resolve({
                type: 'success',
                msUserAchievementsApiUrl: solutionUrl
              })
            );
            const msUsername = 'ANRandom';
            await createMSUsernameRecord(msUsername);

            const resOne = await superPost(
              '/ms-trophy-challenge-completed'
            ).send({ id: trophyChallengeId });

            mockVerifyTrophyWithMicrosoft.mockImplementationOnce(() =>
              Promise.resolve({
                type: 'success',
                msUserAchievementsApiUrl: solutionUrl
              })
            );
            const resTwo = await superPost(
              '/ms-trophy-challenge-completed'
            ).send({ id: trophyChallengeId2 });

            // sending the second trophy challenge again should not change
            // anything
            mockVerifyTrophyWithMicrosoft.mockImplementationOnce(() =>
              Promise.resolve({
                type: 'success',
                msUserAchievementsApiUrl: solutionUrl
              })
            );
            const resUpdate = await superPost(
              '/ms-trophy-challenge-completed'
            ).send({ id: trophyChallengeId2 });

            const { completedChallenges, progressTimestamps } =
              await fastifyTestInstance.prisma.user.findUniqueOrThrow({
                where: { id: defaultUserId }
              });

            expect(completedChallenges).toHaveLength(2);
            expect(completedChallenges).toStrictEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  id: trophyChallengeId,
                  solution: solutionUrl,
                  completedDate: resOne.body.completedDate
                }),
                expect.objectContaining({
                  id: trophyChallengeId2,
                  solution: solutionUrl,
                  completedDate: resTwo.body.completedDate
                })
              ])
            );

            const expectedProgressTimestamps = completedChallenges.map(
              challenge => challenge.completedDate
            );
            expect(progressTimestamps).toStrictEqual(
              expectedProgressTimestamps
            );

            expect(resUpdate.body).toStrictEqual({
              alreadyCompleted: true,
              points: 2,
              completedDate: expect.any(Number)
            });

            // If a challenge has already been completed, it should return the
            // original completedDate
            expect(resUpdate.body.completedDate).toBe(
              resTwo.body.completedDate
            );
            expect(resUpdate.statusCode).toBe(200);
          });
        });
      });
    });

    describe('/exam-challenge-completed', () => {
      afterEach(async () => {
        await fastifyTestInstance.prisma.user.updateMany({
          where: { id: defaultUserId },
          data: {
            completedChallenges: [],
            completedExams: [],
            progressTimestamps: []
          }
        });
      });

      describe('validation', () => {
        test('POST rejects requests with no body', async () => {
          const response = await superRequest('/exam-challenge-completed', {
            method: 'POST',
            setCookies
          });

          expect(response.body).toStrictEqual({
            error: `Valid request body not found in attempt to submit exam.`
          });
          expect(response.statusCode).toBe(400);
        });

        test('POST rejects requests without valid ObjectID', async () => {
          const response = await superRequest('/exam-challenge-completed', {
            method: 'POST',
            setCookies
          }).send({ id: 'not-a-valid-id' });

          expect(response.body).toStrictEqual({
            error: `Valid request body not found in attempt to submit exam.`
          });
          expect(response.statusCode).toBe(400);
        });

        test('POST rejects requests with valid, but non existing ID', async () => {
          const response = await superRequest('/exam-challenge-completed', {
            method: 'POST',
            setCookies
          }).send({
            id: '647e22d18acb466c97ccbef0',
            challengeType: 17,
            userCompletedExam: {
              examTimeInSeconds: 111,
              userExamQuestions: [
                {
                  id: 'q-id',
                  question: '?',
                  answer: {
                    id: 'a-id',
                    answer: 'a'
                  }
                }
              ]
            }
          });

          expect(response.body).toStrictEqual({
            error: `An error occurred trying to get the exam from the database.`
          });
          expect(response.statusCode).toBe(400);
        });

        test('POST rejects requests without valid userCompletedExam schema', async () => {
          const response = await superRequest('/exam-challenge-completed', {
            method: 'POST',
            setCookies
          }).send({
            id: examChallengeId,
            challengeType: 17,
            userCompletedExam: ''
          });

          expect(response.body).toStrictEqual({
            error: `Valid request body not found in attempt to submit exam.`
          });
          expect(response.statusCode).toBe(400);
        });

        test('POST rejects requests without valid examTimeInSeconds schema', async () => {
          const response = await superRequest('/exam-challenge-completed', {
            method: 'POST',
            setCookies
          }).send({
            id: examChallengeId,
            challengeType: 17,
            userCompletedExam: { examTimeInSeconds: 'a' }
          });

          expect(response.body).toStrictEqual({
            error: `Valid request body not found in attempt to submit exam.`
          });
          expect(response.statusCode).toBe(400);
        });

        test('POST rejects requests without valid userExamQuestions schema', async () => {
          const response = await superRequest('/exam-challenge-completed', {
            method: 'POST',
            setCookies
          }).send({
            id: examChallengeId,
            challengeType: 17,
            userCompletedExam: { examTimeInSeconds: 11, userExamQuestions: [] }
          });

          expect(response.body).toStrictEqual({
            error: `Valid request body not found in attempt to submit exam.`
          });
          expect(response.statusCode).toBe(400);
        });

        test('POST rejects requests with prerequisites not completed', async () => {
          const response = await superRequest('/exam-challenge-completed', {
            method: 'POST',
            setCookies
          }).send({
            id: examChallengeId,
            challengeType: 17,
            userCompletedExam: {
              examTimeInSeconds: 111,
              userExamQuestions: [
                {
                  id: 'q-id',
                  question: '?',
                  answer: {
                    id: 'a-id',
                    answer: 'a'
                  }
                }
              ]
            }
          });

          expect(response.body).toStrictEqual({
            error: `You have not completed the required challenges to start the 'Exam Certification'.`
          });
          expect(response.statusCode).toBe(403);
        });

        test('POST rejects requests with invalid userCompletedExam values', async () => {
          await fastifyTestInstance.prisma.user.updateMany({
            where: { email: 'foo@bar.com' },
            data: {
              completedChallenges: completedTrophyChallenges
            }
          });

          const response = await superRequest('/exam-challenge-completed', {
            method: 'POST',
            setCookies
          }).send({
            id: examChallengeId,
            challengeType: 17,
            userCompletedExam: {
              examTimeInSeconds: 111,
              userExamQuestions: [
                {
                  id: 'q-id',
                  question: '?',
                  answer: {
                    id: 'a-id',
                    answer: 'a'
                  }
                }
              ]
            }
          });

          expect(response.body).toStrictEqual({
            error: `An error occurred trying to submit your exam.`
          });
          expect(response.statusCode).toBe(500);
        });
      });

      describe('handling', () => {
        beforeEach(async () => {
          await fastifyTestInstance.prisma.user.updateMany({
            where: { id: defaultUserId },
            data: {
              completedChallenges: completedTrophyChallenges
            }
          });
        });

        afterEach(async () => {
          await fastifyTestInstance.prisma.user.updateMany({
            where: { id: defaultUserId },
            data: {
              completedChallenges: [],
              completedExams: [],
              progressTimestamps: []
            }
          });
        });

        const submitExam = async (exam: ExamSubmission) => {
          return superRequest('/exam-challenge-completed', {
            method: 'POST',
            setCookies
          }).send({
            id: examChallengeId,
            challengeType: 17,
            userCompletedExam: exam
          });
        };

        test('POST handles submitting a failing exam', async () => {
          // Submit exam with 0 correct answers
          const response = await submitExam(examWithZeroCorrect);

          type GetSessionUserResponseBody = Static<
            (typeof getSessionUser)['response']['200']
          >['user'];

          const res = (await superGet('/user/get-session-user')).body as {
            user: GetSessionUserResponseBody;
          };

          const { completedChallenges, completedExams, calendar } =
            res.user[defaultUsername]!;

          // should have the 1 prerequisite challenge
          expect(completedChallenges).toHaveLength(1);
          expect(completedExams).toHaveLength(1);
          expect(calendar).toStrictEqual({});
          expect(completedChallenges).toEqual(completedTrophyChallenges);
          expect(completedExams[0]).toEqual({
            id: '647e22d18acb466c97ccbef8',
            challengeType: 17,
            completedDate: DATE_NOW,
            examResults: mockResultsZeroCorrect
          });

          expect(completedExams[0]?.completedDate).toEqual(DATE_NOW);
          expect(response.body).toMatchObject({
            points: 0,
            alreadyCompleted: false,
            examResults: mockResultsZeroCorrect
          });
          expect(response.statusCode).toBe(200);
        });

        test("POST always adds to the user's completedExams", async () => {
          // The first exam should be stored in the user's completedExams
          await submitExam(examWithAllCorrect);

          let { completedExams } =
            await fastifyTestInstance.prisma.user.findFirstOrThrow({
              where: { id: defaultUserId }
            });

          expect(completedExams).toHaveLength(1);
          expect(completedExams[0]).toEqual(completedExamChallengeAllCorrect);
          expect(completedExams[0]?.completedDate).toEqual(DATE_NOW);

          // the second exam should be added to the exams, not replace the first
          await submitExam(examWithOneCorrect);

          completedExams = (
            await fastifyTestInstance.prisma.user.findFirstOrThrow({
              where: { id: defaultUserId }
            })
          ).completedExams;

          expect(completedExams).toHaveLength(2);
          expect(completedExams).toEqual(
            expect.arrayContaining([
              completedExamChallengeAllCorrect,
              completedExamChallengeOneCorrect
            ])
          );
          expect(completedExams[1]?.completedDate).toEqual(DATE_NOW);
        });

        test('POST updates user progress if they have not completed the exam before', async () => {
          // Submit exam with 2/3 correct answers
          const res = await submitExam(examWithTwoCorrect);

          const user = await fastifyTestInstance.prisma.user.findFirstOrThrow({
            where: { id: defaultUserId }
          });

          // should add to completedChallenges
          expect(user.completedChallenges).toHaveLength(2);
          expect(user.completedChallenges).toMatchObject([
            ...completedTrophyChallenges,
            completedExamChallengeTwoCorrect
          ]);
          expect(user.completedChallenges[1]?.completedDate).toEqual(DATE_NOW);

          // should add to progressTimestamps
          expect(user.progressTimestamps).toHaveLength(1);

          expect(res.body).toMatchObject({
            points: 1,
            alreadyCompleted: false,
            examResults: mockResultsTwoCorrect
          });
          expect(res.statusCode).toBe(200);
        });

        test('POST does not update user progress if new exam is not an improvement', async () => {
          // Submit exam with 2/3 correct answers
          await submitExam(examWithTwoCorrect);

          const user1 = await fastifyTestInstance.prisma.user.findFirstOrThrow({
            where: { id: defaultUserId }
          });

          // Submit exam with 2/3 correct answers (no improvement)
          const res2 = await submitExam(examWithTwoCorrect);

          const user2 = await fastifyTestInstance.prisma.user.findFirstOrThrow({
            where: { id: defaultUserId }
          });

          // should not update user progress
          expect(user2.completedChallenges).toEqual(user1.completedChallenges);
          expect(user2.progressTimestamps).toEqual(user1.progressTimestamps);

          expect(res2.body).toMatchObject({
            points: 1,
            alreadyCompleted: true,
            examResults: mockResultsTwoCorrect
          });
          expect(res2.statusCode).toBe(200);
        });

        test('POST updates user progress if exam is an improvement', async () => {
          // Submit exam with 2/3 correct answers
          await submitExam(examWithTwoCorrect);
          const user1 = await fastifyTestInstance.prisma.user.findUniqueOrThrow(
            {
              where: { id: defaultUserId }
            }
          );

          // Submit improved exam
          const res = await submitExam(examWithAllCorrect);

          const user2 = await fastifyTestInstance.prisma.user.findFirstOrThrow({
            where: { email: 'foo@bar.com' }
          });

          // should update existing completedChallenge
          expect(user2.completedChallenges).toHaveLength(2);
          expect(user2.completedChallenges).toMatchObject([
            ...completedTrophyChallenges,
            completedExamChallengeAllCorrect
          ]);
          expect(user2.completedChallenges[1]?.completedDate).toEqual(
            user1.completedChallenges[1]?.completedDate
          );

          // they have not completed anything new, so progressTimestamps should
          // remain the same
          expect(user2.progressTimestamps).toEqual(user1.progressTimestamps);

          expect(res.body).toMatchObject({
            points: 1,
            alreadyCompleted: true,
            examResults: mockResultsAllCorrect
          });
          expect(res.statusCode).toBe(200);
        });
      });
    });

    describe('/submit-quiz-attempt', () => {
      describe('validation', () => {
        test('POST rejects requests without challengeId', async () => {
          const response = await superPost('/submit-quiz-attempt').send({
            quizId: 'id'
          });

          expect(response.body).toStrictEqual({
            type: 'error',
            message:
              'That does not appear to be a valid quiz attempt submission.'
          });
          expect(response.statusCode).toBe(400);
        });

        test('POST rejects requests without quizId', async () => {
          const response = await superPost('/submit-quiz-attempt').send({
            challengeId: '66df3b712c41c499e9d31e5b'
          });

          expect(response.body).toStrictEqual({
            type: 'error',
            message:
              'That does not appear to be a valid quiz attempt submission.'
          });
          expect(response.statusCode).toBe(400);
        });

        test('POST rejects requests without valid ObjectID', async () => {
          const response = await superPost('/submit-quiz-attempt').send({
            challengeId: 'not-a-valid-id'
          });

          expect(response.body).toStrictEqual({
            type: 'error',
            message:
              'That does not appear to be a valid quiz attempt submission.'
          });
          expect(response.statusCode).toBe(400);
        });
      });

      describe('handling', () => {
        afterEach(async () => {
          await fastifyTestInstance.prisma.user.updateMany({
            where: { email: 'foo@bar.com' },
            data: {
              completedChallenges: [],
              quizAttempts: []
            }
          });
        });

        test('POST adds new attempt to quizAttempts', async () => {
          const response = await superPost('/submit-quiz-attempt').send({
            challengeId: '66df3b712c41c499e9d31e5b',
            quizId: '0'
          });

          const user = await fastifyTestInstance.prisma.user.findFirstOrThrow({
            where: { email: 'foo@bar.com' }
          });

          expect(user).toMatchObject({
            quizAttempts: [
              {
                challengeId: '66df3b712c41c499e9d31e5b',
                quizId: '0',
                timestamp: DATE_NOW
              }
            ]
          });

          expect(response.statusCode).toBe(200);
          expect(response.body).toStrictEqual({});
        });

        test('POST updates the timestamp of the existing attempt', async () => {
          await fastifyTestInstance.prisma.user.updateMany({
            where: { id: defaultUserId },
            data: {
              quizAttempts: [
                {
                  challengeId: '66df3b712c41c499e9d31e5b', // quiz-basic-html
                  quizId: '0',
                  timestamp: EXISTING_COMPLETED_DATE
                },
                {
                  challengeId: '66ed903cf45ce3ece4053ebe', // quiz-semantic-html
                  quizId: '1',
                  timestamp: EXISTING_COMPLETED_DATE
                }
              ]
            }
          });

          const response = await superPost('/submit-quiz-attempt').send({
            challengeId: '66df3b712c41c499e9d31e5b',
            quizId: '1'
          });

          const user = await fastifyTestInstance.prisma.user.findFirstOrThrow({
            where: { email: 'foo@bar.com' }
          });

          expect(user).toMatchObject({
            quizAttempts: [
              {
                challengeId: '66df3b712c41c499e9d31e5b',
                quizId: '1',
                timestamp: DATE_NOW
              },
              {
                challengeId: '66ed903cf45ce3ece4053ebe',
                quizId: '1',
                timestamp: EXISTING_COMPLETED_DATE
              }
            ]
          });

          expect(response.statusCode).toBe(200);
          expect(response.body).toStrictEqual({});
        });
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

    const endpoints: { path: string; method: 'POST' | 'GET' }[] = [
      { path: '/coderoad-challenge-completed', method: 'POST' },
      { path: '/project-completed', method: 'POST' },
      { path: '/backend-challenge-completed', method: 'POST' },
      { path: '/modern-challenge-completed', method: 'POST' },
      { path: '/save-challenge', method: 'POST' },
      { path: '/exam/647e22d18acb466c97ccbef8', method: 'GET' },
      { path: '/ms-trophy-challenge-completed', method: 'POST' },
      { path: '/exam-challenge-completed', method: 'POST' }
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
