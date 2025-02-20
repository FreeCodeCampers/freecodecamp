import { createAction } from 'redux-actions';

import { actionTypes } from './action-types';

export const appMount = createAction(actionTypes.appMount);

export const tryToShowDonationModal = createAction(
  actionTypes.tryToShowDonationModal
);

export const allowSectionDonationRequests = createAction(
  actionTypes.allowSectionDonationRequests
);
export const setRenderStartTime = createAction(actionTypes.setRenderStartTime);
export const closeDonationModal = createAction(actionTypes.closeDonationModal);
export const openDonationModal = createAction(actionTypes.openDonationModal);
export const preventSectionDonationRequests = createAction(
  actionTypes.preventSectionDonationRequests
);
export const setIsRandomCompletionThreshold = createAction(
  actionTypes.setIsRandomCompletionThreshold
);
export const updateDonationFormState = createAction(
  actionTypes.updateDonationFormState
);

export const onlineStatusChange = createAction(actionTypes.onlineStatusChange);
export const serverStatusChange = createAction(actionTypes.serverStatusChange);

// TODO: re-evaluate this since /internal is no longer used.
// `hardGoTo` is used to hit the API server directly
// without going through /internal
// used for things like /signin and /signout
export const hardGoTo = createAction(actionTypes.hardGoTo);

export const submitComplete = createAction(actionTypes.submitComplete);
export const updateComplete = createAction(actionTypes.updateComplete);
export const updateFailed = createAction(actionTypes.updateFailed);

export const saveChallenge = createAction(actionTypes.saveChallenge);
export const saveChallengeComplete = createAction(
  actionTypes.saveChallengeComplete
);

export const acceptTerms = createAction(actionTypes.acceptTerms);
export const acceptTermsComplete = createAction(
  actionTypes.acceptTermsComplete
);
export const acceptTermsError = createAction(actionTypes.acceptTermsError);

export const fetchUser = createAction(actionTypes.fetchUser);
export const fetchUserComplete = createAction(actionTypes.fetchUserComplete);
export const fetchUserError = createAction(actionTypes.fetchUserError);

export const toggleTheme = createAction(actionTypes.toggleTheme);
export const setTheme = createAction(actionTypes.setTheme);
export const initializeTheme = createAction(actionTypes.initializeTheme);

export const updateAllChallengesInfo = createAction(
  actionTypes.updateAllChallengesInfo
);
export const updateAllChallengesInfoWithCompletionState = createAction(
  actionTypes.updateAllChallengesInfoWithCompletionState
);

export const postCharge = createAction(actionTypes.postCharge);
export const postChargeProcessing = createAction(
  actionTypes.postChargeProcessing
);
export const postChargeComplete = createAction(actionTypes.postChargeComplete);
export const postChargeError = createAction(actionTypes.postChargeError);

export const updateCard = createAction(actionTypes.updateCard);
export const updateCardError = createAction(actionTypes.updateCardError);
export const updateCardComplete = createAction(actionTypes.updateCardComplete);
export const updateCardRedirecting = createAction(
  actionTypes.updateCardRedirecting
);

export const fetchProfileForUser = createAction(
  actionTypes.fetchProfileForUser
);
export const fetchProfileForUserComplete = createAction(
  actionTypes.fetchProfileForUserComplete
);
export const fetchProfileForUserError = createAction(
  actionTypes.fetchProfileForUserError
);

export const reportUser = createAction(actionTypes.reportUser);
export const reportUserComplete = createAction(actionTypes.reportUserComplete);
export const reportUserError = createAction(actionTypes.reportUserError);

export const resetUserData = createAction(actionTypes.resetUserData);

export const showCert = createAction(actionTypes.showCert);
export const showCertComplete = createAction(actionTypes.showCertComplete);
export const showCertError = createAction(actionTypes.showCertError);

export const updateUserToken = createAction(actionTypes.updateUserToken);
export const deleteUserToken = createAction(actionTypes.deleteUserToken);
export const deleteUserTokenComplete = createAction(
  actionTypes.deleteUserTokenComplete
);

export const startExam = createAction(actionTypes.startExam);
export const stopExam = createAction(actionTypes.stopExam);
export const clearExamResults = createAction(actionTypes.clearExamResults);

export const linkMsUsername = createAction(actionTypes.linkMsUsername);
export const unlinkMsUsername = createAction(actionTypes.unlinkMsUsername);
export const setMsUsername = createAction(actionTypes.setMsUsername);

export const submitSurvey = createAction(actionTypes.submitSurvey);
export const submitSurveyComplete = createAction(
  actionTypes.submitSurveyComplete
);

export const setIsProcessing = createAction(actionTypes.setIsProcessing);

export const closeSignoutModal = createAction(actionTypes.closeSignoutModal);
export const openSignoutModal = createAction(actionTypes.openSignoutModal);
