import { ExamResults, user } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { omit, pick } from 'lodash';
import { challengeTypes } from '../../../shared/config/challenge-types';
import { getChallenges } from './get-challenges';

export const jsCertProjectIds = [
  'aaa48de84e1ecc7c742e1124',
  'a7f4d8f2483413a6ce226cac',
  '56533eb9ac21ba0edf2244e2',
  'aff0395860f5d3034dc0bfc9',
  'aa2e6f85cab2ab736c9a9b24'
];

export const multifileCertProjectIds = getChallenges()
  .filter(c => c.challengeType === challengeTypes.multifileCertProject)
  .map(c => c.id);

export const multifilePythonCertProjectIds = getChallenges()
  .filter(c => c.challengeType === challengeTypes.multifilePythonCertProject)
  .map(c => c.id);

export const msTrophyChallenges = getChallenges()
  .filter(challenge => challenge.challengeType === challengeTypes.msTrophy)
  .map(({ id, msTrophyId }) => ({ id, msTrophyId }));

type SavedChallengeFile = {
  key: string;
  ext: string; // NOTE: This is Ext type in client
  name: string;
  history: string[];
  contents: string;
};

type SavedChallenge = {
  id: string;
  lastSavedDate: number;
  files: SavedChallengeFile[];
};

// TODO: Confirm this type - read comments below
type CompletedChallengeFile = {
  key: string;
  ext: string; // NOTE: This is Ext type in client
  name: string;
  contents: string;

  // These values are present in prop-types and ajax.ts builds with it
  // editableRegionBoundaries?: number[];
  // usesMultifileEditor?: boolean;
  // error: null | string | unknown;
  // head: string;
  // tail: string;
  // seed: string;
  // id: string;
  // history: string[];

  // This value is present in prisma schema
  path?: string | null;
};

// TODO: Should probably prefer `import{CompletedChallenge}from'@prisma/client'` instead of defining it here
export type CompletedChallenge = {
  id: string;
  solution?: string | null;
  githubLink?: string | null;
  challengeType?: number | null;
  completedDate: number;
  isManuallyApproved?: boolean | null;
  files?: CompletedChallengeFile[];
  examResults?: ExamResults | null;
};

/**
 * Helper function to save a user's challenge data. Used in challenge
 * submission endpoints.
 *
 * @param challengeId The id of the submitted challenge.
 * @param savedChallenges The user's saved challenges array.
 * @param challenge The saveble challenge.
 * @returns Update or push the saved challenges.
 */
export function saveUserChallengeData(
  challengeId: string,
  savedChallenges: SavedChallenge[],
  challenge: Omit<SavedChallenge, 'lastSavedDate'>
) {
  const challengeToSave: SavedChallenge = {
    id: challengeId,
    lastSavedDate: Date.now(),
    files: challenge.files?.map(file =>
      pick(file, ['contents', 'key', 'name', 'ext', 'history'])
    )
  };

  const savedIndex = savedChallenges.findIndex(({ id }) => challengeId === id);

  if (savedIndex >= 0) {
    savedChallenges[savedIndex] = challengeToSave;
  } else {
    savedChallenges.push(challengeToSave);
  }

  return savedChallenges;
}

/**
 * Helper function to update a user's challenge data. Used in challenge
 * submission endpoints.
 * TODO: Keep refactoring. This function does too much.
 * @param fastify The Fastify instance.
 * @param user The existing user record.
 * @param challengeId The id of the submitted challenge.
 * @param _completedChallenge The challenge submission.
 * @param timezone The user's timezone.
 * @returns Information about the update.
 */
export async function updateUserChallengeData(
  fastify: FastifyInstance,
  user: user,
  challengeId: string,
  _completedChallenge: CompletedChallenge,
  timezone?: string // TODO: is this required as its not given as a arg anywhere
) {
  const { files, completedDate: newProgressTimeStamp = Date.now() } =
    _completedChallenge;
  let completedChallenge: CompletedChallenge;

  if (
    jsCertProjectIds.includes(challengeId) ||
    multifileCertProjectIds.includes(challengeId) ||
    multifilePythonCertProjectIds.includes(challengeId)
  ) {
    completedChallenge = {
      ..._completedChallenge,
      files: files?.map(
        file =>
          pick(file, [
            'contents',
            'key',
            'index',
            'name',
            'path',
            'ext'
          ]) as CompletedChallengeFile
      )
    };
  } else {
    completedChallenge = omit(_completedChallenge, ['files']);
  }

  const {
    timezone: userTimezone,
    completedChallenges = [],
    needsModeration = false,
    savedChallenges = [],
    progressTimestamps = [],
    partiallyCompletedChallenges = []
  } = user;

  let userSavedChallenges = savedChallenges;

  const oldChallenge = completedChallenges.find(({ id }) => challengeId === id);
  const alreadyCompleted = !!oldChallenge;

  const finalChallenge = alreadyCompleted
    ? {
        ...completedChallenge,
        completedDate: oldChallenge.completedDate
      }
    : completedChallenge;

  const userCompletedChallenges = alreadyCompleted
    ? completedChallenges.map(x => (x.id === challengeId ? finalChallenge : x))
    : [...completedChallenges, finalChallenge];

  const userProgressTimestamps =
    !alreadyCompleted && progressTimestamps && Array.isArray(progressTimestamps)
      ? [...progressTimestamps, newProgressTimeStamp]
      : progressTimestamps;

  if (
    multifileCertProjectIds.includes(challengeId) ||
    multifilePythonCertProjectIds.includes(challengeId)
  ) {
    const challengeToSave: SavedChallenge = {
      id: challengeId,
      lastSavedDate: newProgressTimeStamp,
      files: files?.map(file =>
        pick(file, ['contents', 'key', 'name', 'ext', 'history'])
      ) as SavedChallengeFile[]
    };

    const isSaved = userSavedChallenges.some(({ id }) => challengeId === id);

    userSavedChallenges = isSaved
      ? userSavedChallenges.map(x =>
          x.id === challengeId ? challengeToSave : x
        )
      : [...userSavedChallenges, challengeToSave];
  }

  // remove from partiallyCompleted on submit
  const userPartiallyCompletedChallenges = partiallyCompletedChallenges.filter(
    challenge => challenge.id !== challengeId
  );

  if (
    timezone &&
    timezone !== 'UTC' &&
    !userTimezone &&
    userTimezone === 'UTC'
  ) {
    await fastify.prisma.user.update({
      where: { id: user.id },
      data: {
        timezone: userTimezone
      }
    });
  }

  if (needsModeration) {
    await fastify.prisma.user.update({
      where: { id: user.id },
      data: {
        needsModeration: true
      }
    });
  }

  await fastify.prisma.user.update({
    where: { id: user.id },
    data: {
      completedChallenges: userCompletedChallenges,
      needsModeration,
      savedChallenges: userSavedChallenges,
      progressTimestamps: userProgressTimestamps,
      partiallyCompletedChallenges: userPartiallyCompletedChallenges
    }
  });

  const updateData = {};

  return {
    alreadyCompleted,
    updateData, // Might need to remove this variable as we're updating user object in this function now instead of in the endpoint handler
    completedDate: finalChallenge.completedDate,
    userSavedChallenges
  };
}
