import { createSelector } from 'reselect';
import { challengeTypes } from '../../../../../shared/config/challenge-types';
import {
  completedChallengesSelector,
  allChallengesInfoSelector,
  isSignedInSelector,
  completionStateSelector
} from '../../../redux/selectors';
import {
  getCurrentBlockIds,
  getCompletedChallengesInBlock,
  getCompletedPercentage
} from '../../../utils/get-completion-percentage';
import { ns } from './action-types';

export const challengeFilesSelector = state => state[ns].challengeFiles;
export const challengeMetaSelector = state => state[ns].challengeMeta;
export const challengeTestsSelector = state => state[ns].challengeTests;
export const consoleOutputSelector = state => state[ns].consoleOut;
export const completedChallengesIdsSelector = createSelector(
  completedChallengesSelector,
  completedChallenges => completedChallenges.map(node => node.id)
);
export const isChallengeCompletedSelector = createSelector(
  [completedChallengesIdsSelector, challengeMetaSelector],
  (ids, meta) => ids.includes(meta.id)
);
export const isCodeLockedSelector = state => state[ns].isCodeLocked;
export const isCompletionModalOpenSelector = state =>
  state[ns].modal.completion;
export const isHelpModalOpenSelector = state => state[ns].modal.help;
export const isVideoModalOpenSelector = state => state[ns].modal.video;
export const isResetModalOpenSelector = state => state[ns].modal.reset;
export const isExitExamModalOpenSelector = state => state[ns].modal.exitExam;
export const isFinishExamModalOpenSelector = state =>
  state[ns].modal.finishExam;
export const isSurveyModalOpenSelector = state => state[ns].modal.survey;
export const isExamResultsModalOpenSelector = state =>
  state[ns].modal.examResults;
export const isExitQuizModalOpenSelector = state => state[ns].modal.exitQuiz;
export const isFinishQuizModalOpenSelector = state =>
  state[ns].modal.finishQuiz;
export const isProjectPreviewModalOpenSelector = state =>
  state[ns].modal.projectPreview;
export const isShortcutsModalOpenSelector = state => state[ns].modal.shortcuts;
export const isSubmittingSelector = state => state[ns].isSubmitting;
export const isResettingSelector = state => state[ns].isResetting;

export const isBuildEnabledSelector = state => state[ns].isBuildEnabled;
export const isExecutingSelector = state => state[ns].isExecuting;
export const successMessageSelector = state => state[ns].successMessage;

export const projectFormValuesSelector = state =>
  state[ns].projectFormValues || {};
export const isAdvancingToChallengeSelector = state => state[ns].isAdvancing;
export const chapterSlugSelector = state => state[ns].chapterSlug;
export const portalDocumentSelector = state => state[ns].portalWindow?.document;
export const portalWindowSelector = state => state[ns].portalWindow;

export const userCompletedExamSelector = state => state[ns].userCompletedExam;
export const challengeDataSelector = state => {
  const { challengeType } = challengeMetaSelector(state);
  let challengeData = { challengeType };
  if (challengeType === challengeTypes.backend) {
    const { solution: url = {} } = projectFormValuesSelector(state);
    challengeData = {
      ...challengeData,
      url
    };
  } else if (
    challengeType === challengeTypes.backEndProject ||
    challengeType === challengeTypes.pythonProject
  ) {
    const values = projectFormValuesSelector(state);
    const { solution: url } = values;
    challengeData = {
      ...challengeData,
      ...values,
      url
    };
  } else if (challengeType === challengeTypes.frontEndProject) {
    challengeData = {
      ...challengeData,
      ...projectFormValuesSelector(state)
    };
  } else if (
    challengeType === challengeTypes.html ||
    challengeType === challengeTypes.modern ||
    challengeType === challengeTypes.multifileCertProject ||
    challengeType === challengeTypes.multifilePythonCertProject ||
    challengeType === challengeTypes.python ||
    challengeType === challengeTypes.lab ||
    challengeType === challengeTypes.js ||
    challengeType === challengeTypes.jsProject ||
    challengeType === challengeTypes.jsLab
  ) {
    const { required = [], template = '' } = challengeMetaSelector(state);
    challengeData = {
      ...challengeData,
      challengeFiles: challengeFilesSelector(state),
      required,
      template
    };
  }
  return challengeData;
};

export const currentBlockIdsSelector = createSelector(
  challengeMetaSelector,
  allChallengesInfoSelector,
  (challengeMeta, allChallengesInfo) => {
    const { block, certification, challengeType } = challengeMeta;

    return getCurrentBlockIds(
      allChallengesInfo,
      block,
      certification,
      challengeType
    );
  }
);

export const completedChallengesInBlockSelector = createSelector(
  completedChallengesIdsSelector,
  currentBlockIdsSelector,
  challengeMetaSelector,
  (completedChallengesIds, currentBlockIds, { id }) =>
    getCompletedChallengesInBlock(completedChallengesIds, currentBlockIds, id)
);

export const completedPercentageSelector = createSelector(
  isSignedInSelector,
  completedChallengesSelector,
  challengeMetaSelector,
  currentBlockIdsSelector,
  (isSignedIn, completedChallenges, { id }, currentBlockIds) => {
    if (isSignedIn) {
      const completedPercentage = getCompletedPercentage(
        completedChallenges.map(node => node.id),
        currentBlockIds,
        id
      );
      return completedPercentage;
    } else return 0;
  }
);

export const isBlockNewlyCompletedSelector = state => {
  const completedPercentage = completedPercentageSelector(state);
  const completedChallengesIds = completedChallengesIdsSelector(state);
  const { id } = challengeMetaSelector(state);
  return completedPercentage === 100 && !completedChallengesIds.includes(id);
};

export const isModuleNewlyCompletedSelector = state => {
  const isBlockNewlyCompleted = isBlockNewlyCompletedSelector(state);
  const { chapter, module, block } = challengeMetaSelector(state);

  if (!isBlockNewlyCompleted || !chapter || !module) return;

  const completionState = completionStateSelector(state);

  const incompleteBlocksInModule = completionState
    .find(({ name }) => name === chapter)
    ?.modules.find(({ name }) => name === module)
    ?.blocks.filter(({ isCompleted }) => !isCompleted);

  // The module is completed if the newly completed block
  // is the last block that has `isCompleted === false`.
  return (
    incompleteBlocksInModule?.length === 1 &&
    incompleteBlocksInModule.some(({ name }) => name === block)
  );
};

export const attemptsSelector = state => state[ns].attempts;
export const canFocusEditorSelector = state => state[ns].canFocusEditor;
export const visibleEditorsSelector = state => state[ns].visibleEditors;
export const showPreviewPortalSelector = state => state[ns].showPreviewPortal;
export const showPreviewPaneSelector = state => state[ns].showPreviewPane;
