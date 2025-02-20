import {
  devLogin,
  setupServer,
  superRequest,
  createSuperRequest
} from '../../../jest.utils';

const EXISTING_COMPLETED_DATE = new Date('2024-11-08').getTime();
const DATE_NOW = Date.now();

describe('curriculumSectionRoutes', () => {
  setupServer();

  describe('Authenticated user', () => {
    let setCookies: string[];
    let superPost: ReturnType<typeof createSuperRequest>;

    // Authenticate user
    beforeAll(async () => {
      setCookies = await devLogin();
      superPost = createSuperRequest({ method: 'POST', setCookies });
    });

    describe('/curriculum-section-completed', () => {
      describe('validation', () => {
        test('POST rejects requests without any IDs', async () => {
          const response = await superPost('/curriculum-section-completed');

          expect(response.body).toStrictEqual({
            type: 'error',
            message:
              'That does not appear to be a valid curriculum section submission.'
          });
          expect(response.statusCode).toBe(400);
        });
      });

      describe('handling', () => {
        beforeAll(() => {
          jest.useFakeTimers({
            doNotFake: ['nextTick']
          });
          jest.setSystemTime(DATE_NOW);
        });

        afterAll(() => {
          jest.useRealTimers();
        });

        beforeEach(async () => {
          await fastifyTestInstance.prisma.user.updateMany({
            where: { email: 'foo@bar.com' },
            data: {
              completedModules: [
                {
                  id: 'basic-html',
                  completedDate: EXISTING_COMPLETED_DATE
                }
              ],
              completedChapters: [
                {
                  id: 'html',
                  completedDate: EXISTING_COMPLETED_DATE
                }
              ]
            }
          });
        });

        test('POST adds newly completed module', async () => {
          const res = await superPost('/curriculum-section-completed').send({
            moduleId: 'semantic-html'
          });

          const user = await fastifyTestInstance.prisma.user.findFirstOrThrow({
            where: { email: 'foo@bar.com' }
          });

          expect(user.completedModules).toStrictEqual([
            {
              id: 'basic-html',
              completedDate: EXISTING_COMPLETED_DATE
            },
            {
              id: 'semantic-html',
              completedDate: DATE_NOW
            }
          ]);

          expect(res.body).toStrictEqual({
            module: {
              id: 'semantic-html',
              alreadyCompleted: false,
              completedDate: DATE_NOW
            },
            chapter: null
          });

          expect(res.statusCode).toBe(200);
        });

        test('POST updates completion date of already completed module', async () => {
          const res = await superPost('/curriculum-section-completed').send({
            moduleId: 'basic-html'
          });

          const user = await fastifyTestInstance.prisma.user.findFirstOrThrow({
            where: { email: 'foo@bar.com' }
          });

          expect(user.completedModules).toMatchObject([
            {
              id: 'basic-html',
              completedDate: EXISTING_COMPLETED_DATE
            }
          ]);

          expect(res.body).toStrictEqual({
            module: {
              id: 'basic-html',
              alreadyCompleted: true,
              completedDate: EXISTING_COMPLETED_DATE
            },
            chapter: null
          });

          expect(res.statusCode).toBe(200);
        });

        test('POST adds newly completed chapter', async () => {
          const res = await superPost('/curriculum-section-completed').send({
            chapterId: 'css'
          });

          const user = await fastifyTestInstance.prisma.user.findFirstOrThrow({
            where: { email: 'foo@bar.com' }
          });

          expect(user.completedChapters).toStrictEqual([
            {
              id: 'html',
              completedDate: EXISTING_COMPLETED_DATE
            },
            {
              id: 'css',
              completedDate: DATE_NOW
            }
          ]);

          expect(res.body).toStrictEqual({
            module: null,
            chapter: {
              id: 'css',
              alreadyCompleted: false,
              completedDate: DATE_NOW
            }
          });

          expect(res.statusCode).toBe(200);
        });

        test('POST updates completion date of already completed chapter', async () => {
          const res = await superPost('/curriculum-section-completed').send({
            chapterId: 'html'
          });

          const user = await fastifyTestInstance.prisma.user.findFirstOrThrow({
            where: { email: 'foo@bar.com' }
          });

          expect(user.completedChapters).toMatchObject([
            {
              id: 'html',
              completedDate: EXISTING_COMPLETED_DATE
            }
          ]);

          expect(res.body).toStrictEqual({
            module: null,
            chapter: {
              id: 'html',
              alreadyCompleted: true,
              completedDate: EXISTING_COMPLETED_DATE
            }
          });

          expect(res.statusCode).toBe(200);
        });

        test('POST adds newly completed module and chapter, all at once', async () => {
          const res = await superPost('/curriculum-section-completed').send({
            moduleId: 'semantic-html',
            chapterId: 'css'
          });

          const user = await fastifyTestInstance.prisma.user.findFirstOrThrow({
            where: { email: 'foo@bar.com' }
          });

          expect(user.completedModules).toStrictEqual([
            {
              id: 'basic-html',
              completedDate: EXISTING_COMPLETED_DATE
            },
            {
              id: 'semantic-html',
              completedDate: DATE_NOW
            }
          ]);

          expect(user.completedChapters).toStrictEqual([
            {
              id: 'html',
              completedDate: EXISTING_COMPLETED_DATE
            },
            {
              id: 'css',
              completedDate: DATE_NOW
            }
          ]);

          expect(res.body).toStrictEqual({
            module: {
              id: 'semantic-html',
              alreadyCompleted: false,
              completedDate: DATE_NOW
            },
            chapter: {
              id: 'css',
              alreadyCompleted: false,
              completedDate: DATE_NOW
            }
          });

          expect(res.statusCode).toBe(200);
        });

        test('POST updates already completed module and chapter, all at once', async () => {
          const res = await superPost('/curriculum-section-completed').send({
            moduleId: 'basic-html',
            chapterId: 'html'
          });

          const user = await fastifyTestInstance.prisma.user.findFirstOrThrow({
            where: { email: 'foo@bar.com' }
          });

          expect(user.completedModules).toStrictEqual([
            {
              id: 'basic-html',
              completedDate: EXISTING_COMPLETED_DATE
            }
          ]);

          expect(user.completedChapters).toStrictEqual([
            {
              id: 'html',
              completedDate: EXISTING_COMPLETED_DATE
            }
          ]);

          expect(res.body).toStrictEqual({
            module: {
              id: 'basic-html',
              alreadyCompleted: true,
              completedDate: EXISTING_COMPLETED_DATE
            },
            chapter: {
              id: 'html',
              alreadyCompleted: true,
              completedDate: EXISTING_COMPLETED_DATE
            }
          });

          expect(res.statusCode).toBe(200);
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

    const endpoints: { path: string; method: 'POST' }[] = [
      { path: '/curriculum-section-completed', method: 'POST' }
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
