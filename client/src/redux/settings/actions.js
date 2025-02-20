import { createAction } from 'redux-actions';

import { actionTypes as types } from './action-types';

const checkForSuccessPayload = ({ type, payload }) =>
  type === 'success' ? payload : null;

export const submitNewAbout = createAction(types.submitNewAbout);
export const submitNewAboutComplete = createAction(
  types.submitNewAboutComplete,
  checkForSuccessPayload
);
export const submitNewAboutError = createAction(types.submitNewAboutError);

export const submitNewUsername = createAction(types.submitNewUsername);
export const submitNewUsernameComplete = createAction(
  types.submitNewUsernameComplete,
  ({ type, username }) => (type === 'success' ? username : null)
);
export const submitNewUsernameError = createAction(
  types.submitNewUsernameError
);

export const submitProfileUI = createAction(types.submitProfileUI);
export const submitProfileUIComplete = createAction(
  types.submitProfileUIComplete,
  checkForSuccessPayload
);
export const submitProfileUIError = createAction(types.submitProfileUIError);

export const updateMyEmail = createAction(types.updateMyEmail);
export const updateMyEmailComplete = createAction(types.updateMyEmailComplete);
export const updateMyEmailError = createAction(types.updateMyEmailError);

export const updateMySocials = createAction(types.updateMySocials);
export const updateMySocialsComplete = createAction(
  types.updateMySocialsComplete,
  checkForSuccessPayload
);
export const updateMySocialsError = createAction(types.updateMySocialsError);

export const updateMySound = createAction(types.updateMySound);
export const updateMySoundComplete = createAction(
  types.updateMySoundComplete,
  checkForSuccessPayload
);
export const updateMySoundError = createAction(types.updateMySoundError);

export const updateMyKeyboardShortcuts = createAction(
  types.updateMyKeyboardShortcuts
);
export const updateMyKeyboardShortcutsComplete = createAction(
  types.updateMyKeyboardShortcutsComplete,
  checkForSuccessPayload
);
export const updateMyKeyboardShortcutsError = createAction(
  types.updateMyKeyboardShortcutsError
);

export const updateMyHonesty = createAction(types.updateMyHonesty);
export const updateMyHonestyComplete = createAction(
  types.updateMyHonestyComplete,
  checkForSuccessPayload
);
export const updateMyHonestyError = createAction(types.updateMyHonestyError);

export const updateMyQuincyEmail = createAction(types.updateMyQuincyEmail);
export const updateMyQuincyEmailComplete = createAction(
  types.updateMyQuincyEmailComplete,
  checkForSuccessPayload
);
export const updateMyQuincyEmailError = createAction(
  types.updateMyQuincyEmailError
);

export const updateMyPortfolio = createAction(types.updateMyPortfolio);
export const updateMyPortfolioComplete = createAction(
  types.updateMyPortfolioComplete,
  checkForSuccessPayload
);
export const updateMyPortfolioError = createAction(
  types.updateMyPortfolioError
);

export const updateMyCareer = createAction(types.updateMyCareer);
export const updateMyCareerComplete = createAction(
  types.updateMyCareerComplete,
  checkForSuccessPayload
);
export const updateMyCareerError = createAction(types.updateMyCareerError);

export const validateUsername = createAction(types.validateUsername);
export const validateUsernameComplete = createAction(
  types.validateUsernameComplete
);
export const validateUsernameError = createAction(types.validateUsernameError);

export const verifyCert = createAction(types.verifyCert);
export const verifyCertComplete = createAction(
  types.verifyCertComplete,
  checkForSuccessPayload
);
export const verifyCertError = createAction(types.verifyCertError);

export const resetProgress = createAction(types.resetProgress);
export const resetProgressError = createAction(types.resetProgressError);

export const resetMyEditorLayout = createAction(types.resetMyEditorLayout);
export const resetMyEditorLayoutComplete = createAction(
  types.resetMyEditorLayoutComplete
);
export const resetMyEditorLayoutError = createAction(
  types.resetMyEditorLayoutError
);

export const deleteAccount = createAction(types.deleteAccount);
export const deleteAccountError = createAction(types.deleteAccountError);
