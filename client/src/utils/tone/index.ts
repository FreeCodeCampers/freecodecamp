import store from 'store';
import { FlashMessages } from '../../components/Flash/redux/flash-messages';
import { LocalStorageThemes } from '../../redux/types';
const TRY_AGAIN = 'https://campfire-mode.freecodecamp.org/try-again.mp3';
const CHAL_COMP = 'https://campfire-mode.freecodecamp.org/chal-comp.mp3';

const toneUrls = {
  [LocalStorageThemes.Light]: 'https://campfire-mode.freecodecamp.org/day.mp3',
  [LocalStorageThemes.Dark]: 'https://campfire-mode.freecodecamp.org/night.mp3',
  donation: 'https://campfire-mode.freecodecamp.org/donate.mp3',
  'tests-completed': CHAL_COMP,
  'block-toggle': 'https://tonejs.github.io/audio/berklee/guitar_chord1.mp3',
  'tests-failed': TRY_AGAIN,
  completion: CHAL_COMP,
  [FlashMessages.AccountDeleted]: TRY_AGAIN,
  [FlashMessages.AddNameSuccess]: CHAL_COMP,
  [FlashMessages.AlreadyClaimed]: TRY_AGAIN,
  [FlashMessages.CertClaimSuccess]:
    'https://campfire-mode.freecodecamp.org/cert.mp3',
  [FlashMessages.CertificateMissing]: TRY_AGAIN,
  [FlashMessages.CertsPrivate]: TRY_AGAIN,
  [FlashMessages.ChallengeSaveTooBig]: TRY_AGAIN,
  [FlashMessages.ChallengeSubmitTooBig]: TRY_AGAIN,
  [FlashMessages.CodeSaved]: CHAL_COMP,
  [FlashMessages.CodeSaveError]: TRY_AGAIN,
  [FlashMessages.CodeSaveLess]: TRY_AGAIN,
  [FlashMessages.CompleteProjectFirst]: TRY_AGAIN,
  [FlashMessages.DeleteTokenErr]: TRY_AGAIN,
  [FlashMessages.EmailValid]: CHAL_COMP,
  [FlashMessages.GenerateExamError]: TRY_AGAIN,
  [FlashMessages.HonestFirst]: TRY_AGAIN,
  [FlashMessages.IncompleteSteps]: TRY_AGAIN,
  [FlashMessages.LocalCodeSaved]: CHAL_COMP,
  [FlashMessages.LocalCodeSaveError]: TRY_AGAIN,
  [FlashMessages.MsTranscriptErr1]: TRY_AGAIN,
  [FlashMessages.MsTranscriptErr2]: TRY_AGAIN,
  [FlashMessages.MsTranscriptErr3]: TRY_AGAIN,
  [FlashMessages.MsTranscriptErr4]: TRY_AGAIN,
  [FlashMessages.MsTranscriptErr5]: TRY_AGAIN,
  [FlashMessages.MsTranscriptErr6]: TRY_AGAIN,
  [FlashMessages.MsTranscriptLinked]: CHAL_COMP,
  [FlashMessages.MsTranscriptUnlinked]: CHAL_COMP,
  [FlashMessages.MsTranscriptUnlinkErr]: TRY_AGAIN,
  [FlashMessages.MsProfileErr]: TRY_AGAIN,
  [FlashMessages.MsTrophyErr1]: TRY_AGAIN,
  [FlashMessages.MsTrophyErr2]: TRY_AGAIN,
  [FlashMessages.MsTrophyErr3]: TRY_AGAIN,
  [FlashMessages.MsTrophyErr4]: TRY_AGAIN,
  [FlashMessages.MsTrophyErr5]: TRY_AGAIN,
  [FlashMessages.MsTrophyErr6]: TRY_AGAIN,
  [FlashMessages.MsTrophyVerified]: CHAL_COMP,
  [FlashMessages.NameNeeded]: TRY_AGAIN,
  // [FlashMessages.None]: '',
  [FlashMessages.NotEligible]: TRY_AGAIN,
  [FlashMessages.NotHonest]: TRY_AGAIN,
  [FlashMessages.GenericError]: TRY_AGAIN,
  [FlashMessages.ProfilePrivate]: TRY_AGAIN,
  [FlashMessages.ProgressReset]: TRY_AGAIN,
  [FlashMessages.ProvideUsername]: TRY_AGAIN,
  [FlashMessages.ReallyWeird]: TRY_AGAIN,
  [FlashMessages.ReportSent]: CHAL_COMP,
  [FlashMessages.SigninSuccess]: CHAL_COMP,
  [FlashMessages.StartProjectErr]: TRY_AGAIN,
  [FlashMessages.SurveyErr1]: TRY_AGAIN,
  [FlashMessages.SurveyErr2]: TRY_AGAIN,
  [FlashMessages.SurveyErr3]: TRY_AGAIN,
  [FlashMessages.SurveySuccess]: CHAL_COMP,
  [FlashMessages.TimelinePrivate]: TRY_AGAIN,
  [FlashMessages.TokenDeleted]: CHAL_COMP,
  [FlashMessages.UpdatedAboutMe]: CHAL_COMP,
  [FlashMessages.UpdatedKeyboardShortCuts]: CHAL_COMP,
  [FlashMessages.UpdatedCareer]: CHAL_COMP,
  [FlashMessages.UpdatedPortfolio]: CHAL_COMP,
  [FlashMessages.UpdatedPrivacy]: CHAL_COMP,
  [FlashMessages.UpdatedQunicyEmailSubscription]: CHAL_COMP,
  [FlashMessages.UpdatedSound]: CHAL_COMP,
  [FlashMessages.UpdatedSocials]: CHAL_COMP,
  [FlashMessages.UpdatedThemes]: CHAL_COMP,
  [FlashMessages.UsernameNotFound]: TRY_AGAIN,
  [FlashMessages.UsernameTaken]: TRY_AGAIN,
  [FlashMessages.UsernameUpdated]: CHAL_COMP,
  [FlashMessages.UsernameUsed]: TRY_AGAIN,
  [FlashMessages.UserNotCertified]: TRY_AGAIN,
  [FlashMessages.WrongName]: TRY_AGAIN,
  [FlashMessages.WrongUpdating]: TRY_AGAIN,
  [FlashMessages.WentWrong]: TRY_AGAIN
} as const;

type ToneStates = keyof typeof toneUrls;

export async function playTone(state: ToneStates): Promise<void> {
  const playSound = !!store.get('fcc-sound');
  if (playSound && toneUrls[state]) {
    const Tone = await import('tone');

    const player = new Tone.Player(toneUrls[state]).toDestination();

    const storedVolume = (store.get('soundVolume') as number) ?? 50;
    const calculateDecibel = -60 * (1 - storedVolume / 100);

    player.volume.value = calculateDecibel;

    await Tone.loaded();
    player.start();
  }
}
