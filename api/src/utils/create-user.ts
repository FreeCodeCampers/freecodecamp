import crypto from 'node:crypto';

import { type Prisma } from '@prisma/client';
import { customAlphabet } from 'nanoid';

export const nanoidCharSet =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(nanoidCharSet, 21);

/**
 * Creates the necessary data to reset a user's properties.
 * @returns Default data for resetting a user's properties.
 */
export const createResetProperties = () => ({
  completedChallenges: [], // TODO(Post-MVP): Omit this from the document? (prisma will always return [])
  completedExams: [], // TODO(Post-MVP): Omit this from the document? (prisma will always return [])
  currentChallengeId: '',
  is2018DataVisCert: false,
  is2018FullStackCert: false,
  isApisMicroservicesCert: false,
  isBackEndCert: false,
  isCollegeAlgebraPyCertV8: false,
  isDataAnalysisPyCertV7: false,
  isDataVisCert: false,
  isFoundationalCSharpCertV8: false,
  isFrontEndCert: false,
  isFrontEndLibsCert: false,
  isFullStackCert: false,
  isInfosecCertV7: false,
  isInfosecQaCert: false,
  isJsAlgoDataStructCert: false,
  isJsAlgoDataStructCertV8: false,
  isMachineLearningPyCertV7: false,
  isQaCertV7: false,
  isRelationalDatabaseCertV8: false,
  isRespWebDesignCert: false,
  isSciCompPyCertV7: false,
  needsModeration: false,
  partiallyCompletedChallenges: [], // TODO(Post-MVP): Omit this from the document? (prisma will always return [])
  progressTimestamps: [Date.now()], // TODO(Post-MVP): This may need normalising before we can omit it. Also, does it need to start with a timestamp?
  savedChallenges: [] // TODO(Post-MVP): Omit this from the document? (prisma will always return [])
});

/**
 * Creates the necessary data to create a new user.
 * @param email The email address of the new user.
 * @returns Default data for a new user.
 */
export function createUserInput(email: string): Prisma.userCreateInput {
  const username = 'fcc-' + crypto.randomUUID();
  const externalId = crypto.randomUUID();
  // This explicitly includes all array fields. This is not strictly necessary -
  // Prisma will return an empty array even if the property is missing, but it's
  // probably best to add them to the document, at least until we normalise the
  // data.
  return {
    about: '',
    acceptedPrivacyTerms: false,
    donationEmails: [], // TODO(Post-MVP): Omit this from the document? (prisma will always return [])
    email,
    emailVerified: true, // this should be true until a user changes their email address
    // TODO(Post-MVP): remove externalId?
    externalId,
    isBanned: false,
    isCheater: false,
    isDonating: false,
    isHonest: false,
    keyboardShortcuts: false,
    location: '',
    name: '',
    unsubscribeId: nanoid(),
    picture: '',
    portfolio: [], // TODO(Post-MVP): Omit this from the document? (prisma will always return [])
    career: [], // TODO: Omit this from the document? (prisma will always return [])
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
      showTimeLine: false,
      showCareer: false
    },
    sendQuincyEmail: false,
    theme: 'default',
    username,
    usernameDisplay: username,
    yearsTopContributor: [], // TODO: Omit this from the document? (prisma will always return []),
    ...createResetProperties()
  };
}
