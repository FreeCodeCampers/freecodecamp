import ObjectID from 'bson-objectid';
import { getStepTemplate } from './get-step-template';

// Note: evaluates at highlevel the process, but seedHeads and seedTails could
// be tested if more specifics are needed.
describe('getStepTemplate util', () => {
  it('should be able to create a markdown', () => {
    const baseOutput = `---
id: 60d4ebe4801158d1abe1b18f
title: Step 5
challengeType: 0
dashedName: step-5
---

# --description--

step 5 instructions

# --hints--

Test 1

\`\`\`js

\`\`\`

# --seed-verification--

Verifier 1

\`\`\`js

\`\`\`

# --seed--

## --seed-contents--

\`\`\`html
--fcc-editable-region--

--fcc-editable-region--
\`\`\`\n`;

    const props = {
      challengeId: new ObjectID('60d4ebe4801158d1abe1b18f'),
      challengeSeeds: {
        indexhtml: {
          contents: '',
          editableRegionBoundaries: [0, 2],
          ext: 'html',
          head: '',
          id: '',
          key: 'indexhtml',
          name: 'index',
          tail: ''
        }
      },
      stepNum: 5,
      challengeType: 0
    };

    expect(getStepTemplate(props)).toEqual(baseOutput);
  });
});
