import { nanoidCharSet } from '../../utils/create-user';

const uuidRe = /^[a-f0-9]{8}-([a-f0-9]{4}-){3}[a-f0-9]{12}$/;
const fccUuidRe = /^fcc-[a-f0-9]{8}-([a-f0-9]{4}-){3}[a-f0-9]{12}$/;
const unsubscribeIdRe = new RegExp(`^[${nanoidCharSet}]{21}$`);
const mongodbIdRe = /^[a-f0-9]{24}$/;


// eslint-disable-next-line jsdoc/require-jsdoc
export const newUser = (email: string) => ({
  about: '',
  acceptedPrivacyTerms: false,
  completedChallenges: [],
  completedExams: [],
  completedModules: [],
  completedChapters: [],
  quizAttempts: [],
  currentChallengeId: '',
  donationEmails: [],
  email,
  emailAuthLinkTTL: null,
  emailVerified: true,
  emailVerifyTTL: null,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  externalId: expect.stringMatching(uuidRe),
  githubProfile: null,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  id: expect.stringMatching(mongodbIdRe),
  is2018DataVisCert: false,
  is2018FullStackCert: false,
  isApisMicroservicesCert: false,
  isBackEndCert: false,
  isBanned: false,
  isCheater: false,
  isClassroomAccount: null,
  isDataAnalysisPyCertV7: false,
  isDataVisCert: false,
  isDonating: false,
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
  isCollegeAlgebraPyCertV8: false,
  isRespWebDesignCert: false,
  isSciCompPyCertV7: false,
  keyboardShortcuts: false,
  linkedin: null,
  location: '',
  name: '',
  needsModeration: false,
  newEmail: null,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  unsubscribeId: expect.stringMatching(unsubscribeIdRe),
  partiallyCompletedChallenges: [],
  password: null,
  picture: '',
  portfolio: [],
  profileUI: {
    isLocked: false,
    showAbout: false,
    showCerts: false,
    showDonation: false,
    showHeatMap: false,
    showLocation: false,
    showName: false,
    showPoints: false,
    showPortfolio: false,
    showTimeLine: false
  },
  progressTimestamps: [expect.any(Number)],
  rand: null, // TODO(Post-MVP): delete from schema (it's not used or required).
  savedChallenges: [],
  sendQuincyEmail: false,
  theme: 'default',
  timezone: null,
  twitter: null,
  updateCount: 0, // see extendClient in prisma.ts
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  username: expect.stringMatching(fccUuidRe),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  usernameDisplay: expect.stringMatching(fccUuidRe),
  verificationToken: null,
  website: null,
  yearsTopContributor: []
}
)
