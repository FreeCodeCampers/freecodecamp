const path = require('path');
const { sortChallengeFiles } = require('../sort-challengefiles');
const { viewTypes } = require('../../../shared/config/challenge-types');

const backend = path.resolve(
  __dirname,
  '../../src/templates/Challenges/projects/backend/show.tsx'
);
const classic = path.resolve(
  __dirname,
  '../../src/templates/Challenges/classic/show.tsx'
);
const frontend = path.resolve(
  __dirname,
  '../../src/templates/Challenges/projects/frontend/show.tsx'
);
const codeAlly = path.resolve(
  __dirname,
  '../../src/templates/Challenges/codeally/show.tsx'
);
const intro = path.resolve(
  __dirname,
  '../../src/templates/Introduction/intro.tsx'
);
const superBlockIntro = path.resolve(
  __dirname,
  '../../src/templates/Introduction/super-block-intro.tsx'
);
const quiz = path.resolve(
  __dirname,
  '../../src/templates/Challenges/quiz/show.tsx'
);

const exam = path.resolve(
  __dirname,
  '../../src/templates/Challenges/exam/show.tsx'
);

const msTrophy = path.resolve(
  __dirname,
  '../../src/templates/Challenges/ms-trophy/show.tsx'
);

const fillInTheBlank = path.resolve(
  __dirname,
  '../../src/templates/Challenges/fill-in-the-blank/show.tsx'
);

const generic = path.resolve(
  __dirname,
  '../../src/templates/Challenges/generic/show.tsx'
);

const views = {
  backend,
  classic,
  modern: classic,
  frontend,
  quiz,
  codeAlly,
  exam,
  msTrophy,
  fillInTheBlank,
  generic
};

function getIsFirstStepInBlock(id, edges) {
  const current = edges[id];
  const previous = edges[id - 1];

  if (!previous) return true;
  return previous.node.challenge.block !== current.node.challenge.block;
}

function getTemplateComponent(challengeType) {
  return views[viewTypes[challengeType]];
}

exports.createChallengePages = function (
  createPage,
  { idToNextPathCurrentCurriculum, idToPrevPathCurrentCurriculum }
) {
  return function ({ node }, index, allChallengeEdges) {
    const {
      dashedName,
      disableLoopProtectTests,
      disableLoopProtectPreview,
      certification,
      superBlock,
      chapter,
      module,
      block,
      fields: { slug, blockHashSlug },
      required = [],
      template,
      challengeType,
      id,
      isLastChallengeInBlock
    } = node.challenge;
    // TODO: challengeType === 7 and isPrivate are the same, right? If so, we
    // should remove one of them.

    createPage({
      path: slug,
      component: getTemplateComponent(challengeType),
      context: {
        challengeMeta: {
          blockHashSlug,
          dashedName,
          certification,
          disableLoopProtectTests,
          disableLoopProtectPreview,
          superBlock,
          chapter,
          module,
          block,
          isFirstStep: getIsFirstStepInBlock(index, allChallengeEdges),
          template,
          required,
          isLastChallengeInBlock: isLastChallengeInBlock,
          nextChallengePath: idToNextPathCurrentCurriculum[node.id],
          prevChallengePath: idToPrevPathCurrentCurriculum[node.id],
          id
        },
        projectPreview: getProjectPreviewConfig(
          node.challenge,
          allChallengeEdges
        ),
        id: node.id
      }
    });
  };
};

// TODO: figure out a cleaner way to get the last challenge in a block. Create
// it during the curriculum build process and attach it to the first challenge?
// That would remove the need to analyse allChallengeEdges.
function getProjectPreviewConfig(challenge, allChallengeEdges) {
  const { block } = challenge;

  const challengesInBlock = allChallengeEdges
    .filter(({ node: { challenge } }) => challenge.block === block)
    .map(({ node: { challenge } }) => challenge);
  const lastChallenge = challengesInBlock[challengesInBlock.length - 1];
  const solutionToLastChallenge = sortChallengeFiles(
    lastChallenge.solutions[0] ?? []
  );
  const lastChallengeFiles = sortChallengeFiles(
    lastChallenge.challengeFiles ?? []
  );
  const projectPreviewChallengeFiles = lastChallengeFiles.map((file, id) => ({
    ...file,
    contents: solutionToLastChallenge[id]?.contents ?? file.contents
  }));

  return {
    challengeData: {
      challengeType: lastChallenge.challengeType,
      challengeFiles: projectPreviewChallengeFiles
    }
  };
}

exports.createBlockIntroPages = function (createPage) {
  return function (edge) {
    const {
      fields: { slug },
      frontmatter: { block },
      id
    } = edge.node;

    createPage({
      path: slug,
      component: intro,
      context: {
        block,
        id
      }
    });
  };
};

exports.createSuperBlockIntroPages = function (createPage) {
  return function (edge) {
    const {
      fields: { slug },
      frontmatter: { superBlock, certification, title }
    } = edge.node;

    if (!certification) {
      throw Error(
        `superBlockIntro page, '${superBlock}' must have certification in frontmatter`
      );
    }

    // TODO: throw if it encounters an unknown certification. Also, handle
    // coding-interview-prep. it's not a certification, but it is a superBlock.

    createPage({
      path: slug,
      component: superBlockIntro,
      context: {
        certification,
        superBlock,
        title
      }
    });
  };
};
