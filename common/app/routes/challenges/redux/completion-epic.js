import { Observable } from 'rx';
import { ofType } from 'redux-epic';

import {
  types,

  moveToNextChallenge,
  clearSavedCode,

  challengeMetaSelector
} from './';

import {
  createErrorObservable,
  updateUserPoints,
  updateUserChallenge,

  challengeSelector
} from '../../../redux';
import { backEndProject } from '../../../utils/challengeTypes.js';
import { makeToast } from '../../../Toasts/redux';
import { postJSON$ } from '../../../../utils/ajax-stream.js';

function postChallenge(url, username, _csrf, challengeInfo) {
  const body = { ...challengeInfo, _csrf };
  const saveChallenge$ = postJSON$(url, body)
    .retry(3)
    .flatMap(({ points, lastUpdated, completedDate }) => {
      return Observable.of(
        updateUserPoints(username, points),
        updateUserChallenge(
          username,
          { ...challengeInfo, lastUpdated, completedDate }
        ),
        clearSavedCode()
      );
    })
    .catch(createErrorObservable);
  const challengeCompleted$ = Observable.of(moveToNextChallenge());
  return Observable.merge(saveChallenge$, challengeCompleted$);
}

function submitModern(type, state) {
  const { tests } = state.challengesApp;
  if (tests.length > 0 && tests.every(test => test.pass && !test.err)) {
    if (type === types.checkChallenge) {
      return Observable.just(null);
    }

    if (type === types.submitChallenge) {
      const { id } = challengeSelector(state);
      const {
        app: { user, csrfToken },
        challengesApp: { files }
      } = state;
      const challengeInfo = { id, files };
      return postChallenge(
        '/modern-challenge-completed',
        user,
        csrfToken,
        challengeInfo
      );
    }
  }
  return Observable.just(
    makeToast({ message: 'Keep trying.' })
  );
}

function submitProject(type, state, { solution, githubLink }) {
  const { id, challengeType } = challengeSelector(state);
  const {
    app: { user, csrfToken }
  } = state;
  const challengeInfo = { id, challengeType, solution };
  if (challengeType === backEndProject) {
    challengeInfo.githubLink = githubLink;
  }
  return postChallenge(
    '/project-completed',
    user,
    csrfToken,
    challengeInfo
  );
}

function submitSimpleChallenge(type, state) {
  const { id } = challengeSelector(state);
  const {
    app: { user, csrfToken }
  } = state;
  const challengeInfo = { id };
  return postChallenge(
    '/challenge-completed',
    user,
    csrfToken,
    challengeInfo
  );
}

function submitBackendChallenge(type, state, { solution }) {
  const { tests } = state.challengesApp;
  if (
    type === types.checkChallenge &&
    tests.length > 0 &&
    tests.every(test => test.pass && !test.err)
  ) {
    /*
    return Observable.of(
      makeToast({
        message: `${randomCompliment()} Go to your next challenge.`,
        action: 'Submit',
        actionCreator: 'submitChallenge',
        timeout: 10000
      })
    );
    */

    const { id } = challengeSelector(state);
    const { app: { user, csrfToken } } = state;
    const challengeInfo = { id, solution };
    return postChallenge(
      '/backend-challenge-completed',
      user,
      csrfToken,
      challengeInfo
    );
  }
  return Observable.just(
    makeToast({ message: 'Keep trying.' })
  );
}

const submitters = {
  tests: submitModern,
  backend: submitBackendChallenge,
  step: submitSimpleChallenge,
  video: submitSimpleChallenge,
  'project.frontEnd': submitProject,
  'project.backEnd': submitProject,
  'project.simple': submitSimpleChallenge
};

export default function completionSaga(actions, { getState }) {
  return actions::ofType(types.checkChallenge, types.submitChallenge)
    .flatMap(({ type, payload }) => {
      const state = getState();
      const { submitType } = challengeMetaSelector(state);
      const submitter = submitters[submitType] ||
        (() => Observable.just(null));
      return submitter(type, state, payload);
    });
}
