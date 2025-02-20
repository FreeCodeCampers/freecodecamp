import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { UserThemes } from '../../redux/types';
import Profile from './profile';

jest.mock('../../analytics');
//workaround to avoid some strange gatsby error:
window.___loader = { enqueue: () => {}, hovering: () => {} };

const userProps = {
  user: {
    acceptedPrivacyTerms: true,
    currentChallengeId: 'string',
    email: 'string',
    emailVerified: true,
    profileUI: {
      isLocked: false,
      showAbout: false,
      showCerts: false,
      showHeatMap: false,
      showLocation: false,
      showName: false,
      showPoints: false,
      showPortfolio: false,
      showTimeLine: false,
      showDonation: false
    },
    calendar: {},
    completedChallenges: [],
    career: [],
    portfolio: [],
    progressTimestamps: [],
    about: 'string',
    githubProfile: 'string',
    isBanned: false,
    isCheater: true,
    isHonest: true,
    joinDate: 'string',
    linkedin: 'string',
    location: 'string',
    name: 'string',
    picture: 'string',
    points: 1,
    savedChallenges: [],
    sendQuincyEmail: true,
    sound: true,
    keyboardShortcuts: false,
    theme: UserThemes.Default,
    twitter: 'string',
    username: 'string',
    website: 'string',
    yearsTopContributor: [],
    isDonating: false,
    is2018DataVisCert: true,
    isApisMicroservicesCert: true,
    isBackEndCert: true,
    isDataVisCert: true,
    isEmailVerified: true,
    isFrontEndCert: true,
    isFrontEndLibsCert: true,
    isFullStackCert: true,
    isInfosecQaCert: true,
    isQaCertV7: true,
    isInfosecCertV7: true,
    isJsAlgoDataStructCert: true,
    isRespWebDesignCert: true,
    isSciCompPyCertV7: true,
    isDataAnalysisPyCertV7: true,
    isMachineLearningPyCertV7: true,
    isRelationalDatabaseCertV8: true,
    isCollegeAlgebraPyCertV8: true,
    isFoundationalCSharpVertV8: true
  },
  navigate: () => {}
};

const notMyProfileProps = {
  isSessionUser: false,
  ...userProps
};
function reducer() {
  return {
    app: { appUsername: 'vasili', user: { vasili: userProps.user } }
  };
}
function renderWithRedux(ui: JSX.Element) {
  return render(<Provider store={createStore(reducer)}>{ui}</Provider>);
}
describe('<Profile/>', () => {
  it('renders the report button on another persons profile', () => {
    // TODO: Profile is a mess, it shouldn't depend on the entire user. Each
    // component Camper, Stats, HeatMap etc should be get the relevant data from
    // the store themselves.

    // @ts-expect-error - quick hack to mollify TS.
    renderWithRedux(<Profile {...notMyProfileProps} />);

    const reportButton: HTMLElement = screen.getByText('buttons.flag-user');
    expect(reportButton).toHaveAttribute('href', '/user/string/report-user');
  });

  it('renders correctly', () => {
    // @ts-expect-error - quick hack to mollify TS.
    const { container } = renderWithRedux(<Profile {...notMyProfileProps} />);

    expect(container).toMatchSnapshot();
  });
});
