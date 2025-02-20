import { Type } from '@fastify/type-provider-typebox';

export const genericError = Type.Object({
  message: Type.Literal('flash.generic-error'),
  type: Type.Literal('danger')
});

export const isCertMap = Type.Object({
  isRespWebDesignCert: Type.Boolean(),
  isJsAlgoDataStructCert: Type.Boolean(),
  isFrontEndLibsCert: Type.Boolean(),
  is2018DataVisCert: Type.Boolean(),
  isApisMicroservicesCert: Type.Boolean(),
  isInfosecQaCert: Type.Boolean(),
  isQaCertV7: Type.Boolean(),
  isInfosecCertV7: Type.Boolean(),
  isFrontEndCert: Type.Boolean(),
  isBackEndCert: Type.Boolean(),
  isDataVisCert: Type.Boolean(),
  isFullStackCert: Type.Boolean(),
  isSciCompPyCertV7: Type.Boolean(),
  isDataAnalysisPyCertV7: Type.Boolean(),
  isMachineLearningPyCertV7: Type.Boolean(),
  isRelationalDatabaseCertV8: Type.Boolean(),
  isCollegeAlgebraPyCertV8: Type.Boolean(),
  isFoundationalCSharpCertV8: Type.Boolean()
});

export const file = Type.Object({
  contents: Type.String(),
  key: Type.String(),
  ext: Type.String(),
  name: Type.String(),
  history: Type.Array(Type.String())
});

// This is only used for serialization, so should not use format. Reason being,
// the serializer's job is simply to create JSON strings, not to validate the
// data.
export const savedChallenge = Type.Object({
  id: Type.String(),
  files: Type.Array(file),
  lastSavedDate: Type.Number()
});

export const examResults = Type.Object({
  numberOfCorrectAnswers: Type.Number(),
  numberOfQuestionsInExam: Type.Number(),
  percentCorrect: Type.Number(),
  passingPercent: Type.Number(),
  passed: Type.Boolean(),
  examTimeInSeconds: Type.Number()
});

export const surveyTitles = Type.Union([
  Type.Literal('Foundational C# with Microsoft Survey')
]);

export const profileUI = Type.Object({
  isLocked: Type.Optional(Type.Boolean()),
  showAbout: Type.Optional(Type.Boolean()),
  showCerts: Type.Optional(Type.Boolean()),
  showDonation: Type.Optional(Type.Boolean()),
  showHeatMap: Type.Optional(Type.Boolean()),
  showLocation: Type.Optional(Type.Boolean()),
  showName: Type.Optional(Type.Boolean()),
  showPoints: Type.Optional(Type.Boolean()),
  showPortfolio: Type.Optional(Type.Boolean()),
  showTimeLine: Type.Optional(Type.Boolean()),
  showCareer: Type.Optional(Type.Boolean())
});
