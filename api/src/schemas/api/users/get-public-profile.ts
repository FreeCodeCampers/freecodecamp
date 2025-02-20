import { Type } from '@fastify/type-provider-typebox';
import { profileUI, examResults, savedChallenge } from '../../types';

export const getPublicProfile = {
  querystring: Type.Object({
    username: Type.String({ minLength: 1 })
  }),
  response: {
    200: Type.Object({
      entities: Type.Object({
        user: Type.Record(
          Type.String(),
          Type.Union([
            Type.Object({
              isLocked: Type.Boolean(),
              profileUI,
              username: Type.String()
            }),
            Type.Object({
              about: Type.String(),
              calendar: Type.Record(Type.Number(), Type.Literal(1)),
              completedChallenges: Type.Array(
                Type.Object({
                  id: Type.String(),
                  completedDate: Type.Number(),
                  solution: Type.Optional(Type.String()),
                  githubLink: Type.Optional(Type.String()),
                  challengeType: Type.Optional(Type.Number()),
                  files: Type.Array(
                    Type.Object({
                      contents: Type.String(),
                      key: Type.String(),
                      ext: Type.String(),
                      name: Type.String(),
                      path: Type.Optional(Type.String())
                    })
                  ),
                  isManuallyApproved: Type.Optional(Type.Boolean()),
                  examResults: Type.Optional(examResults)
                })
              ),
              completedExams: Type.Array(
                Type.Object({
                  id: Type.String(),
                  completedDate: Type.Number(),
                  challengeType: Type.Optional(Type.Number()),
                  examResults
                })
              ),
              // TODO(Post-MVP): return completedSurveys? Presumably not, since why
              // would this need to be public.
              githubProfile: Type.Optional(Type.String()),
              is2018DataVisCert: Type.Boolean(),
              is2018FullStackCert: Type.Boolean(),
              isApisMicroservicesCert: Type.Boolean(),
              isBackEndCert: Type.Boolean(),
              isCheater: Type.Boolean(),
              isCollegeAlgebraPyCertV8: Type.Boolean(),
              isDataAnalysisPyCertV7: Type.Boolean(),
              isDataVisCert: Type.Boolean(),
              // TODO(Post-MVP): isDonating should be boolean.
              isDonating: Type.Union([Type.Boolean(), Type.Null()]),
              isFoundationalCSharpCertV8: Type.Boolean(),
              isFrontEndCert: Type.Boolean(),
              isFrontEndLibsCert: Type.Boolean(),
              isFullStackCert: Type.Boolean(),
              isHonest: Type.Boolean(),
              isInfosecCertV7: Type.Boolean(),
              isInfosecQaCert: Type.Boolean(),
              isJsAlgoDataStructCert: Type.Boolean(),
              isJsAlgoDataStructCertV8: Type.Boolean(),
              isMachineLearningPyCertV7: Type.Boolean(),
              isQaCertV7: Type.Boolean(),
              isRelationalDatabaseCertV8: Type.Boolean(),
              isRespWebDesignCert: Type.Boolean(),
              isSciCompPyCertV7: Type.Boolean(),
              linkedin: Type.Optional(Type.String()),
              location: Type.String(),
              name: Type.String(),
              partiallyCompletedChallenges: Type.Array(
                Type.Object({
                  id: Type.String(),
                  completedDate: Type.Number()
                })
              ),
              picture: Type.String(),
              // TODO(Post-MVP): points should be a number
              points: Type.Union([Type.Number(), Type.Null()]),
              career: Type.Array(
                Type.Object({
                  title: Type.String(),
                  company: Type.String(),
                  location: Type.String(),
                  start_date: Type.String(),
                  end_date: Type.String(),
                  description: Type.String()
                })
              ),
              portfolio: Type.Array(
                Type.Object({
                  description: Type.String(),
                  id: Type.String(),
                  image: Type.String(),
                  title: Type.String(),
                  url: Type.String()
                })
              ),
              profileUI,
              twitter: Type.Optional(Type.String()),
              website: Type.Optional(Type.String()),
              yearsTopContributor: Type.Array(Type.String()), // TODO(Post-MVP): convert to number?
              joinDate: Type.String(),
              savedChallenges: Type.Array(savedChallenge),
              username: Type.String(),
              msUsername: Type.Optional(Type.String())
            })
          ])
        )
      }),
      result: Type.String()
    }),
    // We can't simply have Type.Object({}), even though that's correct, because
    // TypeScript will then accept all responses (since every object can be
    // assigned to {})
    400: Type.Union([
      Type.Object({ entities: Type.Optional(Type.Never()) }),
      Type.Literal(
        'This endpoint is no longer available outside of the freeCodeCamp ecosystem'
      )
    ]),
    404: Type.Object({ entities: Type.Optional(Type.Never()) })
  }
};
