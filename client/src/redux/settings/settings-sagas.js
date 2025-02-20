import { omit } from 'lodash-es';
import {
  call,
  debounce,
  put,
  select,
  takeEvery,
  takeLatest
} from 'redux-saga/effects';
import store from 'store';

import {
  certTypeIdMap,
  certTypes
} from '../../../../shared/config/certification-settings';
import { createFlashMessage } from '../../components/Flash/redux';
import { liveCerts } from '../../../config/cert-and-project-map';
import {
  getUsernameExists,
  putUpdateMyAbout,
  putUpdateMyHonesty,
  putUpdateMyKeyboardShortcuts,
  putUpdateMyCareer,
  putUpdateMyPortfolio,
  putUpdateMyProfileUI,
  putUpdateMyQuincyEmail,
  putUpdateMySocials,
  putUpdateMyUsername,
  putVerifyCert
} from '../../utils/ajax';
import { completedChallengesSelector } from '../selectors';
import {
  resetMyEditorLayoutComplete,
  resetMyEditorLayoutError,
  submitNewAboutComplete,
  submitNewAboutError,
  submitNewUsernameComplete,
  submitNewUsernameError,
  submitProfileUIComplete,
  submitProfileUIError,
  updateMyHonestyComplete,
  updateMyHonestyError,
  updateMyKeyboardShortcutsComplete,
  updateMyKeyboardShortcutsError,
  updateMyCareerComplete,
  updateMyCareerError,
  updateMyPortfolioComplete,
  updateMyPortfolioError,
  updateMyQuincyEmailComplete,
  updateMyQuincyEmailError,
  updateMySocialsComplete,
  updateMySocialsError,
  updateMySoundComplete,
  updateMySoundError,
  validateUsernameComplete,
  validateUsernameError,
  verifyCertComplete,
  verifyCertError
} from './actions';

function* submitNewAboutSaga({ payload }) {
  try {
    const { data } = yield call(putUpdateMyAbout, payload);
    yield put(submitNewAboutComplete({ ...data, payload }));
    yield put(createFlashMessage(data));
  } catch (e) {
    yield put(submitNewAboutError(e));
  }
}

function* submitNewUsernameSaga({ payload: username }) {
  try {
    const { data } = yield call(putUpdateMyUsername, username);
    yield put(submitNewUsernameComplete({ ...data, username }));
    yield put(createFlashMessage(data));
  } catch (e) {
    yield put(submitNewUsernameError(e));
  }
}

function* submitProfileUISaga({ payload }) {
  try {
    const { data } = yield call(putUpdateMyProfileUI, payload);
    yield put(submitProfileUIComplete({ ...data, payload }));
    yield put(createFlashMessage(data));
  } catch (e) {
    yield put(submitProfileUIError);
  }
}

function* updateMySocialsSaga({ payload: update }) {
  try {
    const { data } = yield call(putUpdateMySocials, update);
    yield put(updateMySocialsComplete({ ...data, payload: update }));
    yield put(createFlashMessage({ ...data }));
  } catch (e) {
    yield put(updateMySocialsError);
  }
}

function* updateMySoundSaga({ payload: update }) {
  try {
    store.set('fcc-sound', !!update.sound);
    const data = {
      message: 'flash.updated-sound',
      type: 'success'
    };
    yield put(updateMySoundComplete({ ...data, payload: update }));
    yield put(createFlashMessage({ ...data }));
  } catch (e) {
    yield put(updateMySoundError);
  }
}

function* resetMyEditorLayoutSaga() {
  const layout = store.get('challenge-layout');

  if (layout) {
    try {
      const data = {
        message: 'flash.reset-editor-layout',
        type: 'success'
      };

      store.remove('challenge-layout');

      yield put(createFlashMessage({ ...data }));
      yield put(resetMyEditorLayoutComplete({ ...data }));
    } catch (e) {
      yield put(resetMyEditorLayoutError);
    }
  }
}

function* updateMyKeyboardShortcutsSaga({ payload: update }) {
  try {
    const { data } = yield call(putUpdateMyKeyboardShortcuts, update);
    yield put(updateMyKeyboardShortcutsComplete({ ...data, payload: update }));
    yield put(createFlashMessage({ ...data }));
  } catch (e) {
    yield put(updateMyKeyboardShortcutsError);
  }
}

function* updateMyHonestySaga({ payload: update }) {
  try {
    const { data } = yield call(putUpdateMyHonesty, update);
    yield put(updateMyHonestyComplete({ ...data, payload: update }));
    yield put(createFlashMessage({ ...data }));
  } catch (e) {
    yield put(updateMyHonestyError);
  }
}

function* updateMyQuincyEmailSaga({ payload: update }) {
  try {
    const { data } = yield call(putUpdateMyQuincyEmail, update);
    yield put(updateMyQuincyEmailComplete({ ...data, payload: update }));
    yield put(createFlashMessage({ ...data }));
  } catch (e) {
    yield put(updateMyQuincyEmailError);
  }
}

function* updateMyPortfolioSaga({ payload: update }) {
  try {
    const { data } = yield call(putUpdateMyPortfolio, update);
    yield put(updateMyPortfolioComplete({ ...data, payload: update }));
    yield put(createFlashMessage({ ...data }));
  } catch (e) {
    yield put(updateMyPortfolioError);
  }
}

function* updateMyCareerSaga({ payload: update }) {
  try {
    const { data } = yield call(putUpdateMyCareer, update);
    yield put(updateMyCareerComplete({ ...data, payload: update }));
    yield put(createFlashMessage({ ...data }));
  } catch (e) {
    yield put(updateMyCareerError);
  }
}

function* validateUsernameSaga({ payload }) {
  try {
    const {
      data: { exists }
    } = yield call(getUsernameExists, payload);
    yield put(validateUsernameComplete(exists));
  } catch (e) {
    yield put(validateUsernameError(e));
  }
}

function* verifyCertificationSaga({ payload }) {
  // check redux if can claim cert before calling backend
  const currentCert = liveCerts.find(cert => cert.certSlug === payload);
  const completedChallenges = yield select(completedChallengesSelector);
  const certTitle = currentCert?.title || payload;

  // (20/06/2022) Full Stack client-side validation is already done here:
  // https://github.com/freeCodeCamp/freeCodeCamp/blob/main/client/src/components/settings/certification.js#L309
  if (currentCert?.id !== certTypeIdMap[certTypes.fullStack]) {
    const flash = {
      type: 'info',
      message: 'flash.incomplete-steps',
      variables: { name: certTitle }
    };

    const currentCertIds = currentCert?.projects?.map(project => project.id);
    const canClaimCert = currentCertIds.every(id =>
      completedChallenges.find(challenge => challenge.id === id)
    );

    if (!canClaimCert) {
      yield put(createFlashMessage(flash));
      return;
    }
  }

  // redux says challenges are complete, call back end
  try {
    const {
      data: { response, isCertMap, completedChallenges }
    } = yield call(putVerifyCert, payload);
    yield put(
      verifyCertComplete({
        ...response,
        payload: {
          ...isCertMap,
          completedChallenges: completedChallenges.map(x => ({
            ...omit(x, 'files'),
            challengeFiles: x.files ?? null
          }))
        }
      })
    );
    yield put(createFlashMessage(response));
  } catch (e) {
    yield put(verifyCertError(e));
  }
}

export function createSettingsSagas(types) {
  return [
    takeEvery(types.updateMySocials, updateMySocialsSaga),
    takeEvery(types.updateMyHonesty, updateMyHonestySaga),
    takeEvery(types.updateMySound, updateMySoundSaga),
    takeEvery(types.resetMyEditorLayout, resetMyEditorLayoutSaga),
    takeEvery(types.updateMyKeyboardShortcuts, updateMyKeyboardShortcutsSaga),
    takeEvery(types.updateMyQuincyEmail, updateMyQuincyEmailSaga),
    takeEvery(types.updateMyCareer, updateMyCareerSaga),
    takeEvery(types.updateMyPortfolio, updateMyPortfolioSaga),
    takeLatest(types.submitNewAbout, submitNewAboutSaga),
    takeLatest(types.submitNewUsername, submitNewUsernameSaga),
    debounce(2000, types.validateUsername, validateUsernameSaga),
    takeLatest(types.submitProfileUI, submitProfileUISaga),
    takeEvery(types.verifyCert, verifyCertificationSaga)
  ];
}
