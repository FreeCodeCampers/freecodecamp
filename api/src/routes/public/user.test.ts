import type { Prisma } from '@prisma/client';
import { ObjectId } from 'mongodb';
import _ from 'lodash';

import { createUserInput } from '../../utils/create-user';
import {
  defaultUserEmail,
  setupServer,
  createSuperRequest
} from '../../../jest.utils';
import { getMsTranscriptApiUrl } from '../protected/user';
import { replacePrivateData } from './user';

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
  githubProfile: 'github.com/foobar',
  website: 'https://www.freecodecamp.org',
  donationEmails: ['an@add.ress'],
  career: [],
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
  completedExams: testUserData.completedExams,
  completedSurveys: [], // TODO: add surveys
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
  career: testUserData.career,
  portfolio: testUserData.portfolio,
  profileUI: testUserData.profileUI,
  savedChallenges: testUserData.savedChallenges,
  twitter: 'https://twitter.com/foobar',
  username: testUserData.usernameDisplay, // It defaults to usernameDisplay
  website: testUserData.website,
  yearsTopContributor: testUserData.yearsTopContributor
};

describe('userRoutes', () => {
  setupServer();

  describe('Public', () => {
    let superGet: ReturnType<typeof createSuperRequest>;

    beforeEach(() => {
      superGet = createSuperRequest({ method: 'GET' });
    });

    describe('/api/users/get-public-profile', () => {
      const profilelessUsername = 'profileless-user';
      const lockedUsername = 'locked-user';
      const publicUsername = 'public-user';
      const lockedUserProfileUI = {
        isLocked: true,
        showAbout: true,
        showPortfolio: false
      };
      const unlockedUserProfileUI = {
        isLocked: false,
        showAbout: true,
        showCerts: true,
        showDonation: true,
        showHeatMap: true,
        showLocation: true,
        showName: true,
        showPoints: true,
        showPortfolio: true,
        showCareer: true,
        showTimeLine: true
      };
      const users = [profilelessUsername, lockedUsername, publicUsername];
      beforeAll(async () => {
        await fastifyTestInstance.prisma.user.create({
          data: {
            ...minimalUserData,
            email: profilelessUsername,
            username: profilelessUsername
          }
        });
        await fastifyTestInstance.prisma.user.create({
          data: {
            ...minimalUserData,
            email: lockedUsername,
            username: lockedUsername,
            profileUI: lockedUserProfileUI
          }
        });
        await fastifyTestInstance.prisma.user.create({
          data: {
            ...testUserData,
            email: publicUsername,
            username: publicUsername,
            profileUI: unlockedUserProfileUI
          }
        });
      });

      afterAll(async () => {
        await fastifyTestInstance.prisma.user.deleteMany({
          where: {
            OR: users.map(username => ({ username }))
          }
        });
      });

      describe('GET', () => {
        test('returns 400 status code if the user agent is blocked', async () => {
          const response = await superGet(
            '/api/users/get-public-profile?username=public-user'
          ).set('User-Agent', 'curl');

          expect(response.text).toBe(
            'This endpoint is no longer available outside of the freeCodeCamp ecosystem'
          );
          expect(response.statusCode).toBe(400);
        });

        test('returns 400 status code if the username param is missing', async () => {
          const res = await superGet('/api/users/get-public-profile');
          // TODO(Post-MVP): return something more informative
          expect(res.body).toStrictEqual({});
          expect(res.statusCode).toBe(400);
        });

        test('returns 400 status code if the username param is empty', async () => {
          const res = await superGet('/api/users/get-public-profile?username=');
          // TODO(Post-MVP): return something more informative
          expect(res.body).toStrictEqual({});
          expect(res.statusCode).toBe(400);
        });

        test('returns 404 status code for non-existent user', async () => {
          const response = await superGet(
            '/api/users/get-public-profile?username=non-existent'
          );
          // TODO(Post-MVP): return something more informative
          expect(response.body).toStrictEqual({});
          expect(response.statusCode).toBe(404);
        });

        test('returns 200 status code with a locked profile if the profile is private', async () => {
          const response = await superGet(
            `/api/users/get-public-profile?username=${lockedUsername}`
          );

          expect(response.body).toStrictEqual({
            entities: {
              user: {
                [lockedUsername]: {
                  isLocked: true,
                  profileUI: lockedUserProfileUI,
                  username: lockedUsername
                }
              }
            },
            result: lockedUsername
          });
          expect(response.statusCode).toBe(200);
        });

        test('returns 200 status code locked profile if the profile is missing', async () => {
          const response = await superGet(
            `/api/users/get-public-profile?username=${profilelessUsername}`
          );

          expect(response.body).toStrictEqual({
            entities: {
              user: {
                [profilelessUsername]: {
                  isLocked: true,
                  profileUI: lockedProfileUI,
                  username: profilelessUsername
                }
              }
            },
            result: profilelessUsername
          });
          expect(response.statusCode).toBe(200);
        });
        // TODO: create a list of public properties like the api-server and use that
        // to restrict the output of this and get-session-user.
        test('returns 200 status code with public user object', async () => {
          const testUser =
            await fastifyTestInstance.prisma.user.findFirstOrThrow({
              where: { email: publicUsername }
            });
          const response = await superGet(
            `/api/users/get-public-profile?username=${publicUsername}`
          );

          // TODO: create a fixture for this without 'completedSurveys', ideally
          // it should contain the entire body.
          const publicUser = {
            // TODO(Post-MVP, maybe): return completedSurveys?
            ..._.omit(publicUserData, 'completedSurveys'),
            username: publicUsername,
            joinDate: new ObjectId(testUser.id).getTimestamp().toISOString(),
            profileUI: unlockedUserProfileUI
          };

          expect(response.body).toStrictEqual({
            entities: {
              user: {
                [publicUsername]: publicUser
              }
            },
            result: publicUsername
          });
          expect(response.statusCode).toBe(200);
        });
      });
    });
    describe('GET /api/users/exists', () => {
      beforeAll(async () => {
        await fastifyTestInstance.prisma.user.create({
          data: minimalUserData
        });
      });

      it('should return { exists: true } with a 400 status code if the username param is missing or empty', async () => {
        const res = await superGet('/api/users/exists');

        expect(res.body).toStrictEqual({ exists: true });
        expect(res.statusCode).toBe(400);

        const res2 = await superGet('/api/users/exists?username=');

        expect(res2.body).toStrictEqual({ exists: true });
        expect(res2.statusCode).toBe(400);
      });

      it('should return { exists: true } if the username exists', async () => {
        const res = await superGet('/api/users/exists?username=testuser');

        expect(res.body).toStrictEqual({ exists: true });
        expect(res.statusCode).toBe(200);
      });

      it('should ignore case when checking for username existence', async () => {
        const res = await superGet('/api/users/exists?username=TeStUsEr');

        expect(res.body).toStrictEqual({ exists: true });
        expect(res.statusCode).toBe(200);
      });

      it('should return { exists: false } if the username does not exist', async () => {
        const res = await superGet('/api/users/exists?username=nonexistent');

        expect(res.body).toStrictEqual({ exists: false });
        expect(res.statusCode).toBe(200);
      });

      it('should return { exists: true } if the username is restricted (ignoring case)', async () => {
        const res = await superGet('/api/users/exists?username=pRofIle');

        expect(res.body).toStrictEqual({ exists: true });

        const res2 = await superGet('/api/users/exists?username=flAnge');

        expect(res2.body).toStrictEqual({ exists: true });
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

describe('get-public-profile helpers', () => {
  describe('replacePrivateData', () => {
    const user = {
      about: 'about',
      calendar: { 1: 1, 2: 1 } as const,
      completedChallenges: [
        { id: '123', completedDate: 123, files: [] },
        { id: '456', completedDate: 456, challengeType: 7, files: [] }
      ],
      id: '5f5b1b3b1c9d440000d9e3b4',
      isDonating: false,
      location: 'location',
      joinDate: 'joinDate',
      name: 'name',
      career: [],
      points: 2,
      portfolio: [
        {
          id: '789',
          title: 'portfolio',
          url: 'url',
          image: 'image',
          description: 'description'
        }
      ],
      profileUI: {
        isLocked: false,
        showAbout: true,
        showCerts: true,
        showDonation: true,
        showHeatMap: true,
        showLocation: true,
        showName: true,
        showPoints: true,
        showPortfolio: true,
        showTimeLine: true,
        showCareer: true
      }
    };

    test(`returns "" for 'about' if showAbout is not true`, () => {
      const userWithoutAbout = {
        ...user,
        profileUI: { ...user.profileUI, showAbout: false }
      };
      expect(replacePrivateData(userWithoutAbout)).toMatchObject({
        about: ''
      });
    });

    test('returns {} for calendar if showHeatMap is not true', () => {
      const userWithoutHeatMap = {
        ...user,
        profileUI: { ...user.profileUI, showHeatMap: false }
      };
      expect(replacePrivateData(userWithoutHeatMap).calendar).toEqual({});
    });

    test(`returns [] for completeChallenges if showTimeLine is not true`, () => {
      const userWithoutTimeLine = {
        ...user,
        profileUI: { ...user.profileUI, showTimeLine: false }
      };
      expect(replacePrivateData(userWithoutTimeLine)).toMatchObject({
        completedChallenges: []
      });
    });

    test('omits certifications from completedChallenges if showCerts is not true', () => {
      const userWithoutCerts = {
        ...user,
        profileUI: { ...user.profileUI, showCerts: false }
      };
      expect(replacePrivateData(userWithoutCerts)).toMatchObject({
        completedChallenges: [{ id: '123', completedDate: 123, files: [] }]
      });
    });

    test('returns null for isDonating if showDonation is not true', () => {
      const userWithoutDonation = {
        ...user,
        profileUI: { ...user.profileUI, showDonation: false }
      };
      expect(replacePrivateData(userWithoutDonation)).toMatchObject({
        isDonating: null
      });
    });

    test('returns "" for joinDate if showAbout is not true', () => {
      const userWithoutAbout = {
        ...user,
        profileUI: { ...user.profileUI, showAbout: false }
      };
      expect(replacePrivateData(userWithoutAbout)).toMatchObject({
        joinDate: ''
      });
    });

    test(`returns "" for 'location' if showLocation is not true`, () => {
      const userWithoutLocation = {
        ...user,
        profileUI: { ...user.profileUI, showLocation: false }
      };
      expect(replacePrivateData(userWithoutLocation)).toMatchObject({
        location: ''
      });
    });

    test(`returns "" for 'name' if showName is not true`, () => {
      const userWithoutName = {
        ...user,
        profileUI: { ...user.profileUI, showName: false }
      };
      expect(replacePrivateData(userWithoutName)).toMatchObject({
        name: ''
      });
    });

    test('returns null for points if showPoints is not true', () => {
      const userWithoutPoints = {
        ...user,
        profileUI: { ...user.profileUI, showPoints: false }
      };
      expect(replacePrivateData(userWithoutPoints)).toMatchObject({
        points: null
      });
    });

    test('returns [] for portfolio if showPortfolio is not true', () => {
      const userWithoutPortfolio = {
        ...user,
        profileUI: { ...user.profileUI, showPortfolio: false }
      };
      expect(replacePrivateData(userWithoutPortfolio)).toMatchObject({
        portfolio: []
      });
    });

    test('returns the expected public user object if all showX flags are true', () => {
      expect(replacePrivateData(user)).toEqual(
        _.omit(user, ['id', 'profileUI'])
      );
    });
  });
});
