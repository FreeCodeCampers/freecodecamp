const path = require('path');
const { readFileSync } = require('fs');

const globalConfigPath = path.resolve(__dirname, '../../../shared/config');

function generateCompletedChallengeData() {
  const completedChallenges = [];
  const curriculum = readFileSync(
    `${globalConfigPath}/curriculum.json`,
    'utf8'
  );
  const curriculumParsed = JSON.parse(curriculum);

  delete curriculumParsed.certifications;

  for (const superBlock in curriculumParsed) {
    const ids = [];

    const blocks = curriculumParsed[superBlock]['blocks'];
    for (const block in blocks) {
      const challenges = blocks[block]['challenges'];
      for (const challenge of challenges) {
        if (!ids.includes(challenge.id)) {
          const handleSolution = challenge => {
            if (challenge.solutions.length > 0) {
              return challenge.solutions[0][0]['contents'];
            }

            return null;
          };

          completedChallenges.push({
            id: challenge.id,
            completedDate: Date.now(),
            challengeType: challenge.challengeType,
            files: [],
            solution: handleSolution(challenge)
          });

          ids.push(challenge.id);
        }
      }
    }
  }

  return completedChallenges;
}

module.exports = generateCompletedChallengeData;
