import cookies from 'browser-cookies';
import envData from '../../config/env.json';

import type {
  ChallengeFile,
  ChallengeFiles,
  CompletedChallenge,
  ExamTokenResponse,
  GenerateExamResponseWithData,
  SavedChallenge,
  SavedChallengeFile,
  SurveyResults,
  User
} from '../redux/prop-types';
import { DonationDuration } from '../../../shared/config/donation-settings';

const { apiLocation } = envData;

const base = apiLocation;

const defaultOptions: RequestInit = {
  credentials: 'include'
};

// csrf_token is passed to the client as a cookie. The client must send
// this back as a header.
function getCSRFToken() {
  const token =
    typeof window !== 'undefined' ? cookies.get('csrf_token') : null;
  return token ?? '';
}

export interface ResponseWithData<T> {
  response: Response;
  data: T;
}

// TODO: Might want to handle flash messages as close to the request as possible
// to make use of the Response object (message, status, etc)
async function get<T>(path: string): Promise<ResponseWithData<T>> {
  const response = await fetch(`${base}${path}`, {
    ...defaultOptions,
    headers: { 'CSRF-Token': getCSRFToken() }
  });

  return combineDataWithResponse(response);
}

async function combineDataWithResponse<T>(response: Response) {
  const data = (await response.json()) as T;
  return { response, data };
}

export function post<T = void>(
  path: string,
  body: unknown
): Promise<ResponseWithData<T>> {
  return request('POST', path, body);
}

function put<T = void>(
  path: string,
  body: unknown
): Promise<ResponseWithData<T>> {
  return request('PUT', path, body);
}

function deleteRequest<T = void>(
  path: string,
  body: unknown
): Promise<ResponseWithData<T>> {
  return request('DELETE', path, body);
}

async function request<T>(
  method: 'POST' | 'PUT' | 'DELETE',
  path: string,
  body: unknown
): Promise<ResponseWithData<T>> {
  const options: RequestInit = {
    ...defaultOptions,
    method,
    headers: {
      'CSRF-Token': getCSRFToken(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };

  const response = await fetch(`${base}${path}`, options);
  return combineDataWithResponse(response);
}

/** GET **/

interface SessionUser {
  user?: { [username: string]: User };
}

type CompleteChallengeFromApi = {
  files: Array<Omit<ChallengeFile, 'fileKey'> & { key: string }>;
} & Omit<CompletedChallenge, 'challengeFiles'>;

type SavedChallengeFromApi = {
  files: Array<Omit<SavedChallengeFile, 'fileKey'> & { key: string }>;
} & Omit<SavedChallenge, 'challengeFiles'>;

type ApiSessionResponse = Omit<SessionUser, 'user'>;
type ApiUser = {
  user: {
    [username: string]: Omit<
      User,
      'completedChallenges' & 'savedChallenges'
    > & {
      completedChallenges?: CompleteChallengeFromApi[];
      savedChallenges?: SavedChallengeFromApi[];
    };
  };
  result?: string;
};

type UserResponse = {
  user: { [username: string]: User } | Record<string, never>;
  result: string | undefined;
};

function parseApiResponseToClientUser(data: ApiUser): UserResponse {
  const userData = data.user?.[data?.result ?? ''];
  let completedChallenges: CompletedChallenge[] = [];
  let savedChallenges: SavedChallenge[] = [];
  if (userData) {
    completedChallenges = mapFilesToChallengeFiles(
      userData.completedChallenges
    );
    savedChallenges = mapFilesToChallengeFiles(userData.savedChallenges);
  }
  return {
    user: {
      [data.result ?? '']: { ...userData, completedChallenges, savedChallenges }
    },
    result: data.result
  };
}

// TODO: this at least needs a few aliases so it's human readable
export function mapFilesToChallengeFiles<File, Rest>(
  fileContainer: ({ files: (File & { key: string })[] } & Rest)[] = []
) {
  return fileContainer.map(({ files, ...rest }) => ({
    ...rest,
    challengeFiles: mapKeyToFileKey(files)
  }));
}

function mapKeyToFileKey<K>(
  files: (K & { key: string })[]
): (Omit<K, 'key'> & { fileKey: string })[] {
  return files.map(({ key, ...rest }) => ({ ...rest, fileKey: key }));
}

export function getSessionUser(): Promise<ResponseWithData<SessionUser>> {
  const responseWithData: Promise<
    ResponseWithData<ApiUser & ApiSessionResponse>
  > = get('/user/get-session-user');
  // TODO: Once DB is migrated, no longer need to parse `files` -> `challengeFiles` etc.
  return responseWithData.then(({ response, data }) => {
    const { result, user } = parseApiResponseToClientUser(data);
    return {
      response,
      data: {
        result,
        user
      }
    };
  });
}

type UserProfileResponse = {
  entities: Omit<UserResponse, 'result'>;
  result: string | undefined;
};
export function getUserProfile(
  username: string
): Promise<ResponseWithData<UserProfileResponse>> {
  const responseWithData = get<{ entities?: ApiUser; result?: string }>(
    `/api/users/get-public-profile?username=${username}`
  );
  return responseWithData.then(({ response, data }) => {
    const { result, user } = parseApiResponseToClientUser({
      user: data.entities?.user ?? {},
      result: data.result
    });
    return {
      response,
      data: {
        entities: { user },
        result
      }
    };
  });
}

interface Cert {
  certTitle: string;
  username: string;
  date: Date;
  completionTime: string;
}
export function getShowCert(
  username: string,
  certSlug: string
): Promise<ResponseWithData<Cert>> {
  return get(`/certificate/showCert/${username}/${certSlug}`);
}

export function getUsernameExists(
  username: string
): Promise<ResponseWithData<boolean>> {
  return get(`/api/users/exists?username=${username}`);
}

export function getGenerateExam(
  challengeId: string
): Promise<GenerateExamResponseWithData> {
  return get(`/exam/${challengeId}`);
}

/** POST **/

interface Donation {
  email: string;
  amount: number;
  duration: string;
  provider: string;
  subscriptionId: string;
  customerId: string;
  startDate: Date;
}
// TODO: Verify if the body has and needs this Donation type. The api seems to
// just need the body to exist, but doesn't seem to use the properties.
export function addDonation(body: Donation): Promise<ResponseWithData<void>> {
  return post('/donate/add-donation', body);
}

export function updateStripeCard() {
  return put('/donate/update-stripe-card', {});
}

export function postChargeStripe(
  body: Donation
): Promise<ResponseWithData<void>> {
  return post('/donate/charge-stripe', body);
}

export function postChargeStripeCard(
  body: Donation
): Promise<ResponseWithData<void>> {
  return post('/donate/charge-stripe-card', body);
}

export function generateExamToken(): Promise<
  ResponseWithData<ExamTokenResponse>
> {
  return post('/user/exam-environment/token', {});
}

type PaymentIntentResponse = Promise<
  ResponseWithData<
    | {
        clientSecret?: never;
        subscriptionId?: never;
        error: string;
      }
    | {
        clientSecret: string;
        subscriptionId: string;
        error?: never;
      }
  >
>;

export function createStripePaymentIntent(body: {
  email: string | undefined;
  name: string | undefined;
  amount: number;
  duration: DonationDuration;
}): PaymentIntentResponse {
  return post('/donate/create-stripe-payment-intent', body);
}

interface Report {
  username: string;
  reportDescription: string;
}
export function postReportUser(body: Report): Promise<ResponseWithData<void>> {
  return post('/user/report-user', body);
}

// Both are called without a payload in danger-zone-saga,
// which suggests both are sent without any body
// TODO: Convert to DELETE
export function postDeleteAccount(): Promise<ResponseWithData<void>> {
  return post('/account/delete', {});
}

export function postResetProgress(): Promise<ResponseWithData<void>> {
  return post('/account/reset-progress', {});
}

export function postUserToken(): Promise<ResponseWithData<void>> {
  return post('/user/user-token', {});
}

export function postMsUsername(body: {
  msTranscriptUrl: string;
}): Promise<ResponseWithData<void>> {
  return post('/user/ms-username', body);
}

export function postSaveChallenge(body: {
  id: string;
  files: ChallengeFiles;
}): Promise<ResponseWithData<void>> {
  return post('/save-challenge', body);
}

export function postSubmitSurvey(body: {
  surveyResults: SurveyResults;
}): Promise<ResponseWithData<void>> {
  return post('/user/submit-survey', body);
}

/** PUT **/

interface MyAbout {
  name: string;
  location: string;
  about: string;
  picture: string;
}
export function putUpdateMyAbout(
  values: MyAbout
): Promise<ResponseWithData<void>> {
  return put('/update-my-about', { ...values });
}

export function putUpdateMyUsername(
  username: string
): Promise<ResponseWithData<void>> {
  return put('/update-my-username', { username });
}

export function putUpdateMyProfileUI(
  profileUI: User['profileUI']
): Promise<ResponseWithData<void>> {
  return put('/update-my-profileui', { profileUI });
}

export function putUpdateMySocials(
  update: Record<string, string>
): Promise<ResponseWithData<void>> {
  return put('/update-my-socials', update);
}

export function putUpdateMyKeyboardShortcuts(
  update: Record<string, string>
): Promise<ResponseWithData<void>> {
  return put('/update-my-keyboard-shortcuts', update);
}

export function putUpdateMyHonesty(
  update: Record<string, string>
): Promise<ResponseWithData<void>> {
  return put('/update-my-honesty', update);
}

export function putUpdateMyQuincyEmail(
  update: Record<string, string>
): Promise<ResponseWithData<void>> {
  return put('/update-my-quincy-email', update);
}

export function putUpdateMyPortfolio(
  update: Record<string, string>
): Promise<ResponseWithData<void>> {
  return put('/update-my-portfolio', update);
}

export function putUpdateMyCareer(
  update: Record<string, string>
): Promise<ResponseWithData<void>> {
  return put('/update-my-career', update);
}

export function putUserAcceptsTerms(
  quincyEmails: boolean
): Promise<ResponseWithData<void>> {
  return put('/update-privacy-terms', { quincyEmails });
}

export function putUserUpdateEmail(
  email: string
): Promise<ResponseWithData<void>> {
  return put('/update-my-email', { email });
}

export function putVerifyCert(
  certSlug: string
): Promise<ResponseWithData<void>> {
  return put('/certificate/verify', { certSlug });
}

/** DELETE **/
export function deleteUserToken(): Promise<ResponseWithData<void>> {
  return deleteRequest('/user/user-token', {});
}

export function deleteMsUsername(): Promise<ResponseWithData<void>> {
  return deleteRequest('/user/ms-username', {});
}
