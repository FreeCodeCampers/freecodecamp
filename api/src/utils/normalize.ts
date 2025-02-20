/* This module's job is to parse the database output and prepare it for
serialization */
import {
  ProfileUI,
  CompletedChallenge,
  ExamResults,
  type Survey
} from '@prisma/client';
import _ from 'lodash';

type NullToUndefined<T> = T extends null ? undefined : T;
type NullToFalse<T> = T extends null ? false : T;

type NoNullProperties<T> = {
  [P in keyof T]: NullToUndefined<T[P]>;
};

type DefaultToFalse<T> = {
  [P in keyof T]: NullToFalse<T[P]>;
};

/**
 * Converts a Twitter handle or URL to a URL.
 *
 * @param handleOrUrl Twitter handle or URL.
 * @returns Twitter URL.
 */
export const normalizeTwitter = (
  handleOrUrl: string | null
): string | undefined => {
  if (!handleOrUrl) return undefined;

  let url;
  try {
    new URL(handleOrUrl);
  } catch {
    url = `https://twitter.com/${handleOrUrl.replace(/^@/, '')}`;
  }
  return url ?? handleOrUrl;
};

/**
 * Ensure that the user's profile UI settings are valid.
 *
 * @param maybeProfileUI A null or the user's profile UI settings.
 * @returns The input with nulls removed or a default value if there is no input.
 */
export const normalizeProfileUI = (
  maybeProfileUI: ProfileUI | null
): NoNullProperties<ProfileUI> => {
  return maybeProfileUI
    ? removeNulls(maybeProfileUI)
    : {
        isLocked: true,
        showAbout: false,
        showCerts: false,
        showDonation: false,
        showHeatMap: false,
        showLocation: false,
        showName: false,
        showPoints: false,
        showPortfolio: false,
        showTimeLine: false,
        showCareer: false
      };
};

/**
 * Remove all the null properties from an object.
 *
 * @param obj Any object.
 * @returns The input with nulls removed.
 */
export const removeNulls = <T extends Record<string, unknown>>(
  obj: T
): NoNullProperties<T> =>
  _.pickBy(obj, value => value !== null) as NoNullProperties<T>;

type NormalizedFile = {
  contents: string;
  ext: string;
  key: string;
  name: string;
  path?: string;
};

export type NormalizedChallenge = {
  challengeType?: number;
  completedDate: number;
  files: NormalizedFile[];
  githubLink?: string;
  id: string;
  isManuallyApproved?: boolean;
  solution?: string;
  examResults?: ExamResults;
};

/**
 * Remove all the null properties from a CompletedChallenge array.
 *
 * @param completedChallenges The CompletedChallenge array.
 * @returns The input with nulls removed.
 */
export const normalizeChallenges = (
  completedChallenges: CompletedChallenge[]
): NormalizedChallenge[] => {
  const noNullProps = completedChallenges.map(challenge =>
    removeNulls(challenge)
  );
  // files.path is optional
  const noNullPath = noNullProps.map(challenge => {
    const { files, ...rest } = challenge;
    const noNullFiles = files?.map(file => removeNulls(file));

    return { ...rest, files: noNullFiles };
  });

  return noNullPath;
};

type NormalizedSurvey = {
  title: string;
  responses: {
    question: string;
    response: string;
  }[];
};

/**
 * Remove the extra properties from the SurveyResults array.
 *
 * @param surveyResults The SurveyResults array.
 * @returns The input without the id and userid.
 */
export const normalizeSurveys = (
  surveyResults: Survey[]
): NormalizedSurvey[] => {
  return surveyResults.map(survey => {
    const { title, responses } = survey;
    return { title, responses };
  });
};

/**
 * Replace null flags with false.
 * @param flags Object with nullable boolean flags.
 * @returns Same object with boolean flags, defaulting to false.
 */
export const normalizeFlags = <T extends Record<string, boolean | null>>(
  flags: T
): DefaultToFalse<T> =>
  _.mapValues(flags, flag => flag ?? false) as DefaultToFalse<T>;
