import { select, put, takeEvery } from 'redux-saga/effects';

import { SuperBlocks } from '../../../shared/config/curriculum';
import superBlockStructure from '../../../curriculum/superblock-structure/full-stack.json';
import {
  challengeMetaSelector,
  completedChallengesIdsSelector
} from '../templates/Challenges/redux/selectors';
import { updateAllChallengesInfoWithCompletionState } from './actions';

const getCompletionState = ({
  chapters,
  challenges,
  completedChallengesIds
}) => {
  const populateBlocks = blocks =>
    blocks.map(block => {
      const blockChallenges = challenges.filter(
        ({ block: blockName }) => blockName === block.dashedName
      );

      const completedBlockChallenges = blockChallenges.every(({ id }) =>
        completedChallengesIds.includes(id)
      );

      return {
        name: block.dashedName,
        isCompleted: completedBlockChallenges.length === blockChallenges.length
      };
    });

  const populateModules = modules =>
    modules.map(module => {
      const blocks = populateBlocks(module.blocks);
      const isCompleted = blocks.every(block => block.isCompleted === true);

      return {
        name: module.dashedName,
        blocks,
        isCompleted
      };
    });

  const allChapters = chapters.map(chapter => {
    const modules = populateModules(chapter.modules);
    const isCompleted = modules.every(module => module.isCompleted === true);

    return {
      name: chapter.dashedName,
      modules: populateModules(chapter.modules),
      isCompleted
    };
  });

  return allChapters;
};

function* updateChallengesInfoSaga({ payload }) {
  const { challengeNodes, certificateNodes } = payload;
  const chapters = superBlockStructure.chapters;
  const completedChallengesIds = yield select(completedChallengesIdsSelector);
  const { superBlock: currentSuperBlock } = yield select(challengeMetaSelector);
  let completionState;

  if (currentSuperBlock === SuperBlocks.FullStackDeveloper) {
    completionState = getCompletionState({
      chapters,
      challenges: challengeNodes.map(({ challenge }) => challenge),
      completedChallengesIds
    });
  }

  yield put(
    updateAllChallengesInfoWithCompletionState({
      challengeNodes,
      certificateNodes,
      completionState
    })
  );
}

export function createChallengesInfoSaga(types) {
  return [takeEvery(types.updateAllChallengesInfo, updateChallengesInfoSaga)];
}
