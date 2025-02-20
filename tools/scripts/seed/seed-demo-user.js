const { parseArgs } = require('node:util');

const path = require('path');
const debug = require('debug');
const { MongoClient } = require('mongodb');

require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
const {
  demoUser,
  blankUser,
  publicUser,
  fullyCertifiedUser,
  userIds,
  almostFullyCertifiedUser,
  unclaimedUser
} = require('./user-data');

const options = {
  'set-true': { type: 'string', multiple: true },
  'top-contributor': { type: 'boolean' },
  'set-false': { type: 'string', multiple: true },
  'seed-trophy-challenges': { type: 'boolean' },
  'certified-user': { type: 'boolean' },
  'almost-certified-user': { type: 'boolean' },
  'unclaimed-user': { type: 'boolean' }
};

const { values: argValues } = parseArgs({ options });

const log = debug('fcc:tools:seedLocalAuthUser');
const { MONGOHQ_URL } = process.env;

function handleError(err, client) {
  if (err) {
    console.error('Oh noes!! Error seeding local auth user.');
    console.error(err);
    try {
      client.close();
    } catch (e) {
      // no-op
    } finally {
      process.exit(1);
    }
  }
}

const trophyChallenges = [
  {
    id: '647f85d407d29547b3bee1bb',
    solution:
      'https://learn.microsoft.com/api/gamestatus/achievements/learn.wwl.get-started-c-sharp-part-1.trophy?username=moT01&locale=en-us',
    completedDate: 1695064765244
  },
  {
    id: '647f87dc07d29547b3bee1bf',
    solution:
      'https://learn.microsoft.com/api/gamestatus/achievements/learn.wwl.get-started-c-sharp-part-2.trophy?username=moT01&locale=en-us',
    completedDate: 1695064900926
  },
  {
    id: '647f882207d29547b3bee1c0',
    solution:
      'https://learn.microsoft.com/api/gamestatus/achievements/learn.wwl.get-started-c-sharp-part-3.trophy?username=moT01&locale=en-us',
    completedDate: 1695064949460
  },
  {
    id: '647f867a07d29547b3bee1bc',
    solution:
      'https://learn.microsoft.com/api/gamestatus/achievements/learn.wwl.get-started-c-sharp-part-4.trophy?username=moT01&locale=en-us',
    completedDate: 1695064986634
  },
  {
    id: '647f877f07d29547b3bee1be',
    solution:
      'https://learn.microsoft.com/api/gamestatus/achievements/learn.wwl.get-started-c-sharp-part-5.trophy?username=moT01&locale=en-us',
    completedDate: 1695065026465
  },
  {
    id: '647f86ff07d29547b3bee1bd',
    solution:
      'https://learn.microsoft.com/api/gamestatus/achievements/learn.wwl.get-started-c-sharp-part-6.trophy?username=moT01&locale=en-us',
    completedDate: 1695065060157
  }
];

[demoUser, blankUser, fullyCertifiedUser].forEach(user => {
  if (argValues['top-contributor']) {
    user.yearsTopContributor = ['2017', '2018', '2019'];
  }
  for (const key of argValues['set-false'] || []) {
    user[key] = false;
  }
  for (const key of argValues['set-true'] || []) {
    user[key] = true;
  }
  if (argValues['--seed-trophy-challenges']) {
    user.completedChallenges = trophyChallenges;
  }
});

const client = new MongoClient(MONGOHQ_URL);

const db = client.db('freecodecamp');
const user = db.collection('user');

const dropUserTokens = async function () {
  await db.collection('UserToken').deleteMany({
    userId: {
      $in: userIds
    }
  });
};

const dropUsers = async function () {
  await db.collection('user').deleteMany({
    _id: {
      $in: userIds
    }
  });
};

const run = async () => {
  await client.db('admin').command({ ping: 1 });
  log('Connected successfully to mongo');

  await dropUserTokens();
  await dropUsers();
  if (argValues['certified-user']) {
    await user.insertOne(fullyCertifiedUser);
  } else if (argValues['almost-certified-user']) {
    await user.insertOne(almostFullyCertifiedUser);
  } else if (argValues['unclaimed-user']) {
    await user.insertOne(unclaimedUser);
  } else {
    await user.insertOne(demoUser);
  }

  await user.insertOne(blankUser);
  await user.insertOne(publicUser);

  log('local auth user seed complete');
};

run()
  .then(() => client.close())
  .catch(err => handleError(err, client));
