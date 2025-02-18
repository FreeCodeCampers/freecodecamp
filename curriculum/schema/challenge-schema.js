const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const { challengeTypes } = require('../../shared/config/challenge-types');
const { SuperBlocks } = require('../../shared/config/curriculum');
const {
  availableCharacters,
  availableBackgrounds,
  availableAudios,
  availableAlignments
} = require('./scene-assets');

const slugRE = new RegExp('^[a-z0-9-]+$');
const slugWithSlashRE = new RegExp('^[a-z0-9-/]+$');

const fileJoi = Joi.object().keys({
  fileKey: Joi.string(),
  ext: Joi.string(),
  name: Joi.string(),
  editableRegionBoundaries: [Joi.array().items(Joi.number())],
  path: Joi.string(),
  error: Joi.valid(null),
  head: Joi.string().allow(''),
  tail: Joi.string().allow(''),
  seed: Joi.string().allow(''),
  contents: Joi.string().allow(''),
  id: Joi.string().allow(''),
  history: Joi.array().items(Joi.string().allow(''))
});

const prerequisitesJoi = Joi.object().keys({
  id: Joi.objectId().required(),
  title: Joi.string().required()
});

const positionJoi = Joi.object().keys({
  x: Joi.number().required().strict(),
  y: Joi.number().required().strict(),
  z: Joi.number().required().strict()
});

const setupCharacterJoi = Joi.object().keys({
  character: Joi.string()
    .valid(...availableCharacters)
    .required(),
  position: positionJoi.required(),
  opacity: Joi.number().strict()
});

const setupAudioJoi = Joi.object().keys({
  filename: Joi.string()
    .valid(...availableAudios)
    .required(),
  startTime: Joi.number().required().strict(),
  startTimestamp: Joi.number().strict(),
  finishTimestamp: Joi.number().strict()
});

const setupJoi = Joi.object().keys({
  background: Joi.string()
    .valid(...availableBackgrounds)
    .required(),
  characters: Joi.array().items(setupCharacterJoi).min(1).required(),
  audio: setupAudioJoi.required(),
  alwaysShowDialogue: Joi.boolean()
});

const DialogueJoi = Joi.object().keys({
  text: Joi.string().required(),
  align: Joi.string().valid(...availableAlignments)
});

const commandJoi = Joi.object().keys({
  background: Joi.string().valid(...availableBackgrounds),
  character: Joi.string()
    .valid(...availableCharacters)
    .required(),
  position: positionJoi,
  opacity: Joi.number().strict(),
  startTime: Joi.number().required().strict(),
  finishTime: Joi.number().strict(),
  dialogue: DialogueJoi
});

const questionJoi = Joi.object().keys({
  text: Joi.string().required(),
  answers: Joi.array()
    .items(
      Joi.object().keys({
        answer: Joi.string().required(),
        feedback: Joi.string().allow(null)
      })
    )
    .required()
    .unique('answer'),
  solution: Joi.number().required()
});

const quizJoi = Joi.object().keys({
  questions: Joi.array()
    .items(
      Joi.object().keys({
        text: Joi.string().required(),
        distractors: Joi.array()
          .items(
            Joi.valid(Joi.ref('...answer')).forbidden(),
            Joi.string().required()
          )
          .length(3)
          .required()
          .unique(),
        answer: Joi.string().required()
      })
    )
    .custom((value, helpers) => {
      return value.length === 10 || value.length === 20
        ? value
        : helpers.error('array.invalidLength');
    })
    .messages({
      'array.invalidLength': 'Quiz must have exactly 10 or 20 questions.'
    })
    .required()
});

const schema = Joi.object()
  .keys({
    block: Joi.string().regex(slugRE).required(),
    blockId: Joi.objectId(),
    blockType: Joi.when('superBlock', {
      is: [SuperBlocks.FullStackDeveloper],
      then: Joi.valid(
        'workshop',
        'lab',
        'lecture',
        'review',
        'quiz',
        'exam'
      ).required(),
      otherwise: Joi.valid(null)
    }),
    blockLayout: Joi.valid(
      'challenge-list',
      'challenge-grid',
      'link',
      'project-list',
      'legacy-challenge-list',
      'legacy-link',
      'legacy-challenge-grid'
    ).required(),
    challengeOrder: Joi.number(),
    chapter: Joi.string().when('superBlock', {
      is: 'full-stack-developer',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    certification: Joi.string().regex(slugWithSlashRE),
    challengeType: Joi.number().min(0).max(26).required(),
    checksum: Joi.number(),
    // TODO: require this only for normal challenges, not certs
    dashedName: Joi.string().regex(slugRE),
    demoType: Joi.string().valid('onClick', 'onLoad'),
    description: Joi.when('challengeType', {
      is: [
        challengeTypes.step,
        challengeTypes.video,
        challengeTypes.multipleChoice,
        challengeTypes.fillInTheBlank
      ],
      then: Joi.string().allow(''),
      otherwise: Joi.string().required()
    }),
    disableLoopProtectTests: Joi.boolean().required(),
    disableLoopProtectPreview: Joi.boolean().required(),
    explanation: Joi.when('challengeType', {
      is: [challengeTypes.multipleChoice, challengeTypes.fillInTheBlank],
      then: Joi.string()
    }),
    challengeFiles: Joi.array().items(fileJoi),
    guideUrl: Joi.string().uri({ scheme: 'https' }),
    hasEditableBoundaries: Joi.boolean(),
    helpCategory: Joi.valid(
      'JavaScript',
      'HTML-CSS',
      'Python',
      'Backend Development',
      'C-Sharp',
      'English',
      'Odin',
      'Euler',
      'Rosetta'
    ),
    isLastChallengeInBlock: Joi.boolean().required(),
    videoUrl: Joi.string().allow(''),
    fillInTheBlank: Joi.object().keys({
      sentence: Joi.string().required(),
      blanks: Joi.array()
        .items(
          Joi.object().keys({
            answer: Joi.string().required(),
            feedback: Joi.string().allow(null)
          })
        )
        .required()
    }),
    forumTopicId: Joi.number(),
    id: Joi.objectId().required(),
    instructions: Joi.string().allow(''),
    isComingSoon: Joi.bool(),
    isLocked: Joi.bool(),
    isPrivate: Joi.bool(),
    module: Joi.string().when('superBlock', {
      is: 'full-stack-developer',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    msTrophyId: Joi.when('challengeType', {
      is: [challengeTypes.msTrophy],
      then: Joi.string().required()
    }),
    notes: Joi.string().allow(''),
    order: Joi.number(),
    prerequisites: Joi.when('challengeType', {
      is: [challengeTypes.exam],
      then: Joi.array().items(prerequisitesJoi)
    }),
    // video challenges only:
    videoId: Joi.when('challengeType', {
      is: [challengeTypes.video],
      then: Joi.string().required()
    }),
    videoLocaleIds: Joi.when('challengeType', {
      is: challengeTypes.video,
      then: Joi.object().keys({
        espanol: Joi.string(),
        italian: Joi.string(),
        portuguese: Joi.string()
      })
    }),
    bilibiliIds: Joi.when('challengeType', {
      is: challengeTypes.video,
      then: Joi.object().keys({
        aid: Joi.number().required(),
        bvid: Joi.string().required(),
        cid: Joi.number().required()
      })
    }),
    questions: Joi.when('challengeType', {
      is: [
        challengeTypes.video,
        challengeTypes.multipleChoice,
        challengeTypes.theOdinProject
      ],
      then: Joi.array().items(questionJoi).min(1).required(),
      otherwise: Joi.array().length(0)
    }),
    quizzes: Joi.when('challengeType', {
      is: challengeTypes.quiz,
      then: Joi.array().items(quizJoi).min(1).required(),
      otherwise: Joi.forbidden()
    }),
    required: Joi.array().items(
      Joi.object().keys({
        link: Joi.string(),
        raw: Joi.bool(),
        src: Joi.string(),
        crossDomain: Joi.bool()
      })
    ),
    assignments: Joi.when('challengeType', {
      is: challengeTypes.dialogue,
      then: Joi.array().items(Joi.string()).required(),
      otherwise: Joi.array().items(Joi.string())
    }),
    scene: Joi.object().keys({
      setup: setupJoi.required(),
      commands: Joi.array()
        .items(commandJoi)
        .unique(
          (a, b) =>
            a.dialogue &&
            b.dialogue &&
            !(
              (a.startTime < b.startTime &&
                a.finishTime < b.finishTime &&
                a.finishTime <= b.startTime) ||
              (b.startTime < a.startTime &&
                b.finishTime < a.finishTime &&
                b.finishTime <= a.startTime)
            )
        )
        .messages({
          'array.unique': 'Dialogues must not have overlapping times.'
        })
    }),
    solutions: Joi.array().items(Joi.array().items(fileJoi).min(1)),
    superBlock: Joi.string().regex(slugWithSlashRE),
    superOrder: Joi.number(),
    suborder: Joi.number(),
    tests: Joi.array()
      .items(
        // public challenges
        Joi.object().keys({
          id: Joi.string().allow(''),
          text: Joi.string().required(),
          testString: Joi.string().allow('').required()
        }),
        // our tests used in certification verification
        Joi.object().keys({
          id: Joi.string().required(),
          title: Joi.string().required()
        })
      )
      .required(),
    template: Joi.string().allow(''),
    title: Joi.string().required(),
    transcript: Joi.when('challengeType', {
      is: [challengeTypes.generic, challengeTypes.video],
      then: Joi.string()
    }),
    translationPending: Joi.bool().required(),
    url: Joi.when('challengeType', {
      is: [challengeTypes.codeAllyPractice, challengeTypes.codeAllyCert],
      then: Joi.string().required()
    }),
    usesMultifileEditor: Joi.boolean()
  })
  .xor('helpCategory', 'isPrivate');

exports.challengeSchemaValidator = () => {
  return challenge => schema.validate(challenge);
};
