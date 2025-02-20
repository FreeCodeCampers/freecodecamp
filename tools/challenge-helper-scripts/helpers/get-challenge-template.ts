/* eslint-disable @typescript-eslint/no-base-to-string */
import ObjectID from 'bson-objectid';

const sanitizeTitle = (title: string) => {
  return title.includes(':') || title.includes("'") ? `"${title}"` : title;
};

interface ChallengeOptions {
  challengeId: ObjectID;
  title: string;
  dashedName: string;
  challengeType: string;
}

const buildFrontMatter = ({
  challengeId,
  title,
  dashedName,
  challengeType
}: ChallengeOptions) => `---
id: ${challengeId.toString()}
title: ${sanitizeTitle(title)}
challengeType: ${challengeType}
dashedName: ${dashedName}
---`;

const buildFrontMatterWithVideo = ({
  challengeId,
  title,
  dashedName,
  challengeType
}: ChallengeOptions) => `---
id: ${challengeId.toString()}
videoId: ADD YOUR VIDEO ID HERE!!!
title: ${sanitizeTitle(title)}
challengeType: ${challengeType}
dashedName: ${dashedName}
---`;

const getLegacyChallengeTemplate = (
  options: ChallengeOptions
): string => `${buildFrontMatter(options)}

# --description--

${options.title} description.

# --instructions--

${options.title} instructions.

# --hints--

Test 1

\`\`\`js

\`\`\`

# --seed-verification--

Verifier 1

\`\`\`js

\`\`\`

# --seed--

\`\`\`js

\`\`\`

# --solutions--

\`\`\`js

\`\`\`
`;

const getQuizChallengeTemplate = (
  options: ChallengeOptions
): string => `${buildFrontMatter(options)}

# --description--

To pass the quiz, you must correctly answer at least 17 of the 20 questions below.

# --quizzes--

## --quiz--

### --question--

#### --text--

Placeholder question

#### --distractors--

Placeholder distractor 1

---

Placeholder distractor 2

---

Placeholder distractor 3

#### --answer--

Placeholder answer

### --question--

#### --text--

Placeholder question

#### --distractors--

Placeholder distractor 1

---

Placeholder distractor 2

---

Placeholder distractor 3

#### --answer--

Placeholder answer

### --question--

#### --text--

Placeholder question

#### --distractors--

Placeholder distractor 1

---

Placeholder distractor 2

---

Placeholder distractor 3

#### --answer--

Placeholder answer

### --question--

#### --text--

Placeholder question

#### --distractors--

Placeholder distractor 1

---

Placeholder distractor 2

---

Placeholder distractor 3

#### --answer--

Placeholder answer

### --question--

#### --text--

Placeholder question

#### --distractors--

Placeholder distractor 1

---

Placeholder distractor 2

---

Placeholder distractor 3

#### --answer--

Placeholder answer

### --question--

#### --text--

Placeholder question

#### --distractors--

Placeholder distractor 1

---

Placeholder distractor 2

---

Placeholder distractor 3

#### --answer--

Placeholder answer

### --question--

#### --text--

Placeholder question

#### --distractors--

Placeholder distractor 1

---

Placeholder distractor 2

---

Placeholder distractor 3

#### --answer--

Placeholder answer

### --question--

#### --text--

Placeholder question

#### --distractors--

Placeholder distractor 1

---

Placeholder distractor 2

---

Placeholder distractor 3

#### --answer--

Placeholder answer

### --question--

#### --text--

Placeholder question

#### --distractors--

Placeholder distractor 1

---

Placeholder distractor 2

---

Placeholder distractor 3

#### --answer--

Placeholder answer

### --question--

#### --text--

Placeholder question

#### --distractors--

Placeholder distractor 1

---

Placeholder distractor 2

---

Placeholder distractor 3

#### --answer--

Placeholder answer

### --question--

#### --text--

Placeholder question

#### --distractors--

Placeholder distractor 1

---

Placeholder distractor 2

---

Placeholder distractor 3

#### --answer--

Placeholder answer

### --question--

#### --text--

Placeholder question

#### --distractors--

Placeholder distractor 1

---

Placeholder distractor 2

---

Placeholder distractor 3

#### --answer--

Placeholder answer

### --question--

#### --text--

Placeholder question

#### --distractors--

Placeholder distractor 1

---

Placeholder distractor 2

---

Placeholder distractor 3

#### --answer--

Placeholder answer

### --question--

#### --text--

Placeholder question

#### --distractors--

Placeholder distractor 1

---

Placeholder distractor 2

---

Placeholder distractor 3

#### --answer--

Placeholder answer

### --question--

#### --text--

Placeholder question

#### --distractors--

Placeholder distractor 1

---

Placeholder distractor 2

---

Placeholder distractor 3

#### --answer--

Placeholder answer

### --question--

#### --text--

Placeholder question

#### --distractors--

Placeholder distractor 1

---

Placeholder distractor 2

---

Placeholder distractor 3

#### --answer--

Placeholder answer

### --question--

#### --text--

Placeholder question

#### --distractors--

Placeholder distractor 1

---

Placeholder distractor 2

---

Placeholder distractor 3

#### --answer--

Placeholder answer

### --question--

#### --text--

Placeholder question

#### --distractors--

Placeholder distractor 1

---

Placeholder distractor 2

---

Placeholder distractor 3

#### --answer--

Placeholder answer

### --question--

#### --text--

Placeholder question

#### --distractors--

Placeholder distractor 1

---

Placeholder distractor 2

---

Placeholder distractor 3

#### --answer--

Placeholder answer

### --question--

#### --text--

Placeholder question

#### --distractors--

Placeholder distractor 1

---

Placeholder distractor 2

---

Placeholder distractor 3

#### --answer--

Placeholder answer

`;

const getVideoChallengeTemplate = (
  options: ChallengeOptions
): string => `${buildFrontMatterWithVideo(options)}

# --description--

${options.title} description.

# --question--

## --text--

${options.title} question?

## --answers--

Answer 1

---

Answer 2

---

Answer 3

## --video-solution--

1
`;

const getAssignmentChallengeTemplate = (
  options: ChallengeOptions
): string => `${buildFrontMatter(options)}

# --description--

${options.title} description.

# --assignment--

${options.title} assignment!

# --question--

## --text--

${options.title} question?

## --answers--

Answer 1

---

Answer 2

---

Answer 3

## --video-solution--

1
`;

const getMultipleChoiceChallengeTemplate = (
  options: ChallengeOptions
): string => `${buildFrontMatter(options)}

# --description--

${options.title} description.

# --questions--

## --text--

${options.title} question?

## --answers--

Answer 1

### --feedback--

Include feedback for answer 1 here, but remove these last four lines if this is the correct answer.

---

Answer 2

### --feedback--

Include feedback for answer 2 here, but remove these last four lines if this is the correct answer.

---

Answer 3

### --feedback--

Include feedback for answer 3 here, but remove these last four lines if this is the correct answer.

---

Answer 4

### --feedback--

Include feedback for answer 4 here, but remove these last four lines if this is the correct answer.

## --video-solution--

1
`;

const getFillInTheBlankChallengeTemplate = (
  options: ChallengeOptions
): string => `${buildFrontMatter(options)}

# --description--

${options.title} description.

# --fillInTheBlank--

## --sentence--

\`Fill BLANK the BLANK sentence.\`

## --blanks--

\`in\`

### --feedback--

It's \`in\`

---

\`blank\`
`;

const getDialogueChallengeTemplate = (
  options: ChallengeOptions
): string => `${buildFrontMatter(options)}

# --description--

Watch the video below to understand the context of the upcoming lessons.

# --assignment--

Watch the video.
`;

type Template = (opts: ChallengeOptions) => string;

export const getTemplate = (challengeType: string): Template => {
  const template = challengeTypeToTemplate[challengeType];
  if (!template) {
    throw Error(`Challenge type ${challengeType} has no template.
To create one, please add a new function to this file and include it in the challengeTypeToTemplate map.
`);
  }
  return template;
};

/**
 * This should be kept in parity with the challengeTypes in the
 * client.
 *
 * Keys are explicitly marked null so we know the challenge type itself
 * exists, and can expand this to use the correct template later on.
 */

const challengeTypeToTemplate: {
  [key: string]: null | Template;
} = {
  0: getLegacyChallengeTemplate,
  1: getLegacyChallengeTemplate,
  2: null,
  3: getLegacyChallengeTemplate,
  4: getLegacyChallengeTemplate,
  5: getLegacyChallengeTemplate,
  6: getLegacyChallengeTemplate,
  7: null,
  8: getQuizChallengeTemplate,
  9: null,
  10: null,
  11: getVideoChallengeTemplate,
  12: null,
  13: null,
  14: null,
  15: getAssignmentChallengeTemplate,
  16: null,
  17: null,
  18: null,
  19: getMultipleChoiceChallengeTemplate,
  20: null,
  21: getDialogueChallengeTemplate,
  22: getFillInTheBlankChallengeTemplate
};
