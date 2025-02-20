import { navigate } from 'gatsby';
import { omit } from 'lodash-es';
import { ofType } from 'redux-observable';
import { empty, of } from 'rxjs';
import {
  catchError,
  concat,
  retry,
  switchMap,
  tap,
  mergeMap
} from 'rxjs/operators';
import { createFlashMessage } from '../../../components/Flash/redux';
import {
  standardErrorMessage,
  msTrophyVerified
} from '../../../utils/error-messages';
import {
  challengeTypes,
  submitTypes
} from '../../../../../shared/config/challenge-types';
import { actionTypes as submitActionTypes } from '../../../redux/action-types';
import {
  allowBlockDonationRequests,
  setIsProcessing,
  setRenderStartTime,
  submitComplete,
  updateComplete,
  updateFailed
} from '../../../redux/actions';
import { isSignedInSelector, userSelector } from '../../../redux/selectors';
import { mapFilesToChallengeFiles } from '../../../utils/ajax';
import { standardizeRequestBody } from '../../../utils/challenge-request-helpers';
import postUpdate$ from '../utils/post-update';
import { actionTypes } from './action-types';
import {
  closeModal,
  updateSolutionFormValues,
  setIsAdvancing,
  submitChallengeComplete,
  submitChallengeError
} from './actions';
import {
  challengeFilesSelector,
  challengeMetaSelector,
  challengeTestsSelector,
  userCompletedExamSelector,
  projectFormValuesSelector,
  isBlockNewlyCompletedSelector
} from './selectors';

function postChallenge(update) {
  const {
    payload: { challengeType }
  } = update;
  const saveChallenge = postUpdate$(update).pipe(
    retry(3),
    switchMap(({ data }) => {
      const { type, savedChallenges, message, examResults } = data;
      const payloadWithClientProperties = {
        ...omit(update.payload, ['files'])
      };
      if (update.payload.files) {
        payloadWithClientProperties.challengeFiles = update.payload.files.map(
          ({ key, ...rest }) => ({
            ...rest,
            fileKey: key
          })
        );
      }

      let actions = [
        submitComplete({
          submittedChallenge: payloadWithClientProperties,
          savedChallenges: mapFilesToChallengeFiles(savedChallenges),
          examResults
        }),
        updateComplete(),
        submitChallengeComplete()
      ];

      if (
        type === 'error' ||
        (message && challengeType === challengeTypes.msTrophy)
      ) {
        actions = [];
        if (message) {
          actions.push(createFlashMessage(data));
        }
        actions.push(submitChallengeError());
      } else if (challengeType === challengeTypes.msTrophy) {
        actions.push(createFlashMessage(msTrophyVerified));
      }

      return of(...actions);
    }),
    catchError(() => of(updateFailed(update), submitChallengeError()))
  );
  return saveChallenge;
}

function submitModern(type, state) {
  const challengeType = state.challenge.challengeMeta.challengeType;
  const tests = challengeTestsSelector(state);
  if (tests.length === 0 || tests.every(test => test.pass && !test.err)) {
    if (type === actionTypes.checkChallenge) {
      return of({ type: 'this was a check challenge' });
    }

    if (type === actionTypes.submitChallenge) {
      const { id, block } = challengeMetaSelector(state);
      const challengeFiles = challengeFilesSelector(state);

      let body;
      if (
        block === 'javascript-algorithms-and-data-structures-projects' ||
        challengeType === challengeTypes.multifileCertProject ||
        challengeType === challengeTypes.multifilePythonCertProject
      ) {
        body = standardizeRequestBody({ id, challengeType, challengeFiles });
      } else {
        body = {
          id,
          challengeType
        };
      }

      const update = {
        endpoint: '/modern-challenge-completed',
        payload: body
      };
      return postChallenge(update);
    }
  }
  return empty();
}

function submitProject(type, state) {
  if (type === actionTypes.checkChallenge) {
    return empty();
  }

  const { solution, githubLink } = projectFormValuesSelector(state);
  const { id, challengeType } = challengeMetaSelector(state);
  const { username } = userSelector(state);
  const challengeInfo = { id, challengeType, solution };
  if (challengeType === challengeTypes.backEndProject) {
    challengeInfo.githubLink = githubLink;
  }

  const update = {
    endpoint: '/project-completed',
    payload: challengeInfo
  };
  return postChallenge(update, username).pipe(
    concat(of(updateSolutionFormValues({})))
  );
}

function submitBackendChallenge(type, state) {
  const tests = challengeTestsSelector(state);
  if (tests.length > 0 && tests.every(test => test.pass && !test.err)) {
    if (type === actionTypes.submitChallenge) {
      const { id } = challengeMetaSelector(state);
      const {
        solution: { value: solution }
      } = projectFormValuesSelector(state);
      const challengeInfo = { id, solution };

      const update = {
        endpoint: '/backend-challenge-completed',
        payload: challengeInfo
      };
      return postChallenge(update);
    }
  }
  return empty();
}

const submitters = {
  tests: submitModern,
  backend: submitBackendChallenge,
  'project.frontEnd': submitProject,
  'project.backEnd': submitProject,
  exam: submitExam,
  msTrophy: submitMsTrophy
};

function submitExam(type, state) {
  // TODO: verify shape of examResults?
  if (type === actionTypes.submitChallenge) {
    const { id, challengeType } = challengeMetaSelector(state);
    const userCompletedExam = userCompletedExamSelector(state);

    const { username } = userSelector(state);
    const challengeInfo = { id, challengeType, userCompletedExam };

    const update = {
      endpoint: '/exam-challenge-completed',
      payload: challengeInfo
    };
    return postChallenge(update, username);
  }
  return empty();
}

function submitMsTrophy(type, state) {
  if (type === actionTypes.submitChallenge) {
    const { id, challengeType } = challengeMetaSelector(state);

    const challengeInfo = { id, challengeType };

    const update = {
      endpoint: '/ms-trophy-challenge-completed',
      payload: challengeInfo
    };
    return postChallenge(update);
  }
  return empty();
}

export default function completionEpic(action$, state$) {
  return action$.pipe(
    ofType(actionTypes.submitChallenge),
    switchMap(({ type }) => {
      const state = state$.value;

      const {
        isLastChallengeInBlock,
        nextChallengePath,
        challengeType,
        superBlock,
        block,
        blockHashSlug
      } = challengeMetaSelector(state);
      // Default to submitChallengeComplete since we do not want the user to
      // be stuck in the 'isSubmitting' state.
      let submitter = () => of(submitChallengeComplete());
      if (
        !(challengeType in submitTypes) ||
        !(submitTypes[challengeType] in submitters)
      ) {
        throw new Error(
          'Unable to find the correct submit function for challengeType ' +
            challengeType
        );
      }

      if (isSignedInSelector(state)) {
        submitter = submitters[submitTypes[challengeType]];
      }

      let pathToNavigateTo = isLastChallengeInBlock
        ? blockHashSlug
        : nextChallengePath;

      const canAllowDonationRequest = (state, action) =>
        isBlockNewlyCompletedSelector(state) &&
        action.type === submitActionTypes.submitComplete;

      return submitter(type, state).pipe(
        concat(
          of(setIsAdvancing(!isLastChallengeInBlock), setIsProcessing(false))
        ),
        mergeMap(x =>
          canAllowDonationRequest(state, x)
            ? of(x, allowBlockDonationRequests({ superBlock, block }))
            : of(x)
        ),
        mergeMap(x => of(x, setRenderStartTime(Date.now()))),
        tap(res => {
          if (res.type !== submitActionTypes.updateFailed) {
            if (challengeType !== challengeTypes.exam) {
              navigate(pathToNavigateTo);
            }
          } else {
            createFlashMessage(standardErrorMessage);
          }
        }),
        concat(of(closeModal('completion')))
      );
    })
  );
}
