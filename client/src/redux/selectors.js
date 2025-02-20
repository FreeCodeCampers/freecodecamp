import { Certification } from '../../../shared/config/certification-settings';
import { SuperBlocks } from '../../../shared/config/curriculum';
import { randomBetween } from '../utils/random-between';
import { getSessionChallengeData } from '../utils/session-storage';
import { ns as MainApp } from './action-types';

export const savedChallengesSelector = state =>
  userSelector(state).savedChallenges || [];
export const completedChallengesSelector = state =>
  userSelector(state).completedChallenges || [];
export const userIdSelector = state => userSelector(state).id;
export const partiallyCompletedChallengesSelector = state =>
  userSelector(state).partiallyCompletedChallenges || [];
export const currentChallengeIdSelector = state =>
  state[MainApp].currentChallengeId;
export const isRandomCompletionThresholdSelector = state =>
  state[MainApp].isRandomCompletionThreshold;
export const isDonatingSelector = state => userSelector(state).isDonating;
export const isOnlineSelector = state => state[MainApp].isOnline;
export const isServerOnlineSelector = state => state[MainApp].isServerOnline;
export const isSignedInSelector = state => !!state[MainApp].appUsername;
export const isDonationModalOpenSelector = state =>
  state[MainApp].showDonationModal;
export const isSignoutModalOpenSelector = state =>
  state[MainApp].showSignoutModal;
export const recentlyClaimedBlockSelector = state =>
  state[MainApp].recentlyClaimedBlock;
export const recentlyClaimedModuleSelector = state =>
  state[MainApp].recentlyClaimedModule;
export const donationFormStateSelector = state =>
  state[MainApp].donationFormState;
export const updateCardStateSelector = state => state[MainApp].updateCardState;
export const signInLoadingSelector = state =>
  userFetchStateSelector(state).pending;
export const showCertSelector = state => state[MainApp].showCert;
export const showCertFetchStateSelector = state =>
  state[MainApp].showCertFetchState;
export const shouldRequestDonationSelector = state => {
  const completedChallengeCount = completedChallengesSelector(state).length;
  const isDonating = isDonatingSelector(state);
  const recentlyClaimedBlock = recentlyClaimedBlockSelector(state);
  const recentlyClaimedModule = recentlyClaimedModuleSelector(state);
  const isRandomCompletionThreshold =
    isRandomCompletionThresholdSelector(state);

  // don't request donation if already donating
  if (isDonating) return false;

  // donations only appear after the user has completed ten challenges (i.e.
  // not before the 11th challenge has mounted)
  if (completedChallengeCount < 10) return false;

  // a block or module has been completed
  if (
    recentlyClaimedBlock &&
    recentlyClaimedBlock.superBlock !== SuperBlocks.FullStackDeveloper
  )
    return true;

  if (
    recentlyClaimedModule &&
    recentlyClaimedModule.superBlock === SuperBlocks.FullStackDeveloper
  )
    return true;

  const sessionChallengeData = getSessionChallengeData();
  /*
    Different intervals need to be tested for optimization.
   */
  // the assumption is that we save the count when we request donations
  if (sessionChallengeData.isSaved) {
    // only request if sufficient challenges have been completed since last
    // request
    return sessionChallengeData.countSinceSave >= 20;
  }

  /*
   Show modal if user has completed 10 challanged in total
   and 3 or more in this session.
   The isRandomCompletionThreshold flag is used to AB test interval randomness
  */
  if (isRandomCompletionThreshold) {
    return sessionChallengeData.currentCount >= randomBetween(3, 7);
  } else {
    return sessionChallengeData.currentCount >= 3;
  }
};

export const userTokenSelector = state => {
  return userSelector(state).userToken;
};

export const examInProgressSelector = state => {
  return state[MainApp].examInProgress;
};

export const examResultsSelector = state => userSelector(state).examResults;

export const msUsernameSelector = state => {
  return userSelector(state).msUsername;
};

export const completedSurveysSelector = state =>
  userSelector(state).completedSurveys || [];

export const isProcessingSelector = state => {
  return state[MainApp].isProcessing;
};

export const userByNameSelector = username => state => {
  const { user } = state[MainApp];
  // return initial state empty user empty object instead of empty
  // object literal to prevent components from re-rendering unnecessarily
  // TODO: confirm if "initialState" can be moved here or action-types.js
  return user[username] ?? {};
};

export const currentCertsSelector = state =>
  certificatesByNameSelector(state[MainApp]?.appUsername)(state)?.currentCerts;

export const certificatesByNameSelector = username => state => {
  const {
    isRespWebDesignCert,
    is2018DataVisCert,
    isFrontEndLibsCert,
    isJsAlgoDataStructCert,
    isApisMicroservicesCert,
    isInfosecQaCert,
    isQaCertV7,
    isInfosecCertV7,
    isFrontEndCert,
    isBackEndCert,
    isDataVisCert,
    isFullStackCert,
    isSciCompPyCertV7,
    isDataAnalysisPyCertV7,
    isMachineLearningPyCertV7,
    isRelationalDatabaseCertV8,
    isCollegeAlgebraPyCertV8,
    isFoundationalCSharpCertV8,
    isJsAlgoDataStructCertV8
  } = userByNameSelector(username)(state);
  return {
    hasModernCert:
      isRespWebDesignCert ||
      is2018DataVisCert ||
      isFrontEndLibsCert ||
      isApisMicroservicesCert ||
      isQaCertV7 ||
      isInfosecCertV7 ||
      isFullStackCert ||
      isSciCompPyCertV7 ||
      isDataAnalysisPyCertV7 ||
      isMachineLearningPyCertV7 ||
      isRelationalDatabaseCertV8 ||
      isCollegeAlgebraPyCertV8 ||
      isFoundationalCSharpCertV8 ||
      isJsAlgoDataStructCertV8,
    hasLegacyCert:
      isFrontEndCert ||
      isJsAlgoDataStructCert ||
      isBackEndCert ||
      isDataVisCert ||
      isInfosecQaCert,
    isFullStackCert,
    currentCerts: [
      {
        show: isRespWebDesignCert,
        title: 'Responsive Web Design Certification',
        certSlug: Certification.RespWebDesign
      },
      {
        show: isJsAlgoDataStructCertV8,
        title: 'JavaScript Algorithms and Data Structures Certification',
        certSlug: Certification.JsAlgoDataStructNew
      },
      {
        show: isFrontEndLibsCert,
        title: 'Front End Development Libraries Certification',
        certSlug: Certification.FrontEndDevLibs
      },
      {
        show: is2018DataVisCert,
        title: 'Data Visualization Certification',
        certSlug: Certification.DataVis
      },
      {
        show: isRelationalDatabaseCertV8,
        title: 'Relational Database Certification',
        certSlug: Certification.RelationalDb
      },
      {
        show: isApisMicroservicesCert,
        title: 'Back End Development and APIs Certification',
        certSlug: Certification.BackEndDevApis
      },
      {
        show: isQaCertV7,
        title: 'Quality Assurance Certification',
        certSlug: Certification.QualityAssurance
      },
      {
        show: isSciCompPyCertV7,
        title: 'Scientific Computing with Python Certification',
        certSlug: Certification.SciCompPy
      },
      {
        show: isDataAnalysisPyCertV7,
        title: 'Data Analysis with Python Certification',
        certSlug: Certification.DataAnalysisPy
      },
      {
        show: isInfosecCertV7,
        title: 'Information Security Certification',
        certSlug: Certification.InfoSec
      },
      {
        show: isMachineLearningPyCertV7,
        title: 'Machine Learning with Python Certification',
        certSlug: Certification.MachineLearningPy
      },
      {
        show: isCollegeAlgebraPyCertV8,
        title: 'College Algebra with Python Certification',
        certSlug: Certification.CollegeAlgebraPy
      },
      {
        show: isFoundationalCSharpCertV8,
        title: 'Foundational C# with Microsoft Certification',
        certSlug: Certification.FoundationalCSharp
      }
    ],
    legacyCerts: [
      {
        show: isFrontEndCert,
        title: 'Front End Certification',
        certSlug: Certification.LegacyFrontEnd
      },
      {
        show: isJsAlgoDataStructCert,
        title: 'Legacy JavaScript Algorithms and Data Structures Certification',
        certSlug: Certification.JsAlgoDataStruct
      },
      {
        show: isBackEndCert,
        title: 'Back End Certification',
        certSlug: Certification.LegacyBackEnd
      },
      {
        show: isDataVisCert,
        title: 'Data Visualization Certification',
        certSlug: Certification.LegacyDataVis
      },
      {
        show: isInfosecQaCert,
        title: 'Information Security and Quality Assurance Certification',
        // Keep the current public profile cert slug
        certSlug: Certification.LegacyInfoSecQa
      },
      {
        show: isFullStackCert,
        title: 'Full Stack Certification',
        // Keep the current public profile cert slug
        certSlug: Certification.LegacyFullStack
      }
    ]
  };
};

export const userFetchStateSelector = state => state[MainApp].userFetchState;
export const allChallengesInfoSelector = state =>
  state[MainApp].allChallengesInfo;
export const completionStateSelector = state => state[MainApp].completionState;
export const userProfileFetchStateSelector = state =>
  state[MainApp].userProfileFetchState;
export const usernameSelector = state => state[MainApp].appUsername;
export const themeSelector = state => state[MainApp].theme;
export const userThemeSelector = state => {
  return userSelector(state).theme;
};
export const userSelector = state => {
  const username = usernameSelector(state);

  return state[MainApp].user[username] || {};
};

export const renderStartTimeSelector = state => state[MainApp].renderStartTime;
