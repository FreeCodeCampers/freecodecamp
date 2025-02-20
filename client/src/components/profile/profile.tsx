import React, { useState } from 'react';
import Helmet from 'react-helmet';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Alert, Container, Modal, Row, Spacer } from '@freecodecamp/ui';
import { FullWidthRow, Link } from '../helpers';
import Portfolio from './components/portfolio';

import UsernameSettings from './components/username';
import About from './components/about';
import Internet, { Socials } from './components/internet';
import { User } from './../../redux/prop-types';
import Timeline from './components/time-line';
import Camper from './components/camper';
import Certifications from './components/certifications';
import Stats from './components/stats';
import HeatMap from './components/heat-map';
import './profile.css';
import { PortfolioProjects } from './components/portfolio-projects';
import CareerTimeline from './components/career-timeline';

interface ProfileProps {
  isSessionUser: boolean;
  user: User;
  updateMyPortfolio: () => void;
  updateMySocials: (formValues: Socials) => void;
  updateMyCareer: () => void;
  submitNewAbout: () => void;
}

interface EditModalProps {
  user: User;
  isEditing: boolean;
  isSessionUser: boolean;
  setIsEditing: (isEditing: boolean) => void;
  updateMySocials: (formValues: Socials) => void;
  updateMyPortfolio: () => void;
  submitNewAbout: () => void;
}
interface MessageProps {
  isSessionUser: boolean;
  t: TFunction;
  username: string;
}

const UserMessage = ({ t }: Pick<MessageProps, 't'>) => {
  return (
    <FullWidthRow>
      <Alert variant='info'>{t('profile.you-change-privacy')}</Alert>
      <Spacer size='xl' />
    </FullWidthRow>
  );
};

const EditModal = ({
  user,
  isEditing,
  isSessionUser,
  setIsEditing,
  updateMyPortfolio,
  updateMySocials,
  submitNewAbout
}: EditModalProps) => {
  const {
    portfolio,
    username,
    about,
    location,
    name,
    picture,
    githubProfile,
    linkedin,
    twitter,
    website
  } = user;
  const { t } = useTranslation();
  return (
    <Modal onClose={() => setIsEditing(false)} open={isEditing} size='large'>
      <Modal.Header>{t('profile.edit-my-profile')}</Modal.Header>
      <Modal.Body alignment='left'>
        <UsernameSettings username={username} setIsEditing={setIsEditing} />
        <Spacer size='m' />
        <About
          about={about}
          location={location}
          name={name}
          picture={picture}
          username={username}
          submitNewAbout={submitNewAbout}
          setIsEditing={setIsEditing}
          isSessionUser={isSessionUser}
        />
        <Spacer size='m' />
        <Internet
          githubProfile={githubProfile}
          linkedin={linkedin}
          twitter={twitter}
          updateSocials={updateMySocials}
          setIsEditing={setIsEditing}
          website={website}
        />
        <Spacer size='m' />
        <Portfolio
          portfolio={portfolio}
          updatePortfolio={updateMyPortfolio}
          setIsEditing={setIsEditing}
        />
      </Modal.Body>
    </Modal>
  );
};

const VisitorMessage = ({
  t,
  username
}: Omit<MessageProps, 'isSessionUser'>) => {
  return (
    <FullWidthRow>
      <Alert variant='info'>
        {t('profile.username-change-privacy', { username })}
      </Alert>
      <Spacer size='m' />
    </FullWidthRow>
  );
};

const Message = ({ isSessionUser, t, username }: MessageProps) => {
  if (isSessionUser) {
    return <UserMessage t={t} />;
  }
  return <VisitorMessage t={t} username={username} />;
};

function UserProfile({
  user,
  isSessionUser,
  updateMyPortfolio,
  updateMySocials,
  updateMyCareer,
  submitNewAbout
}: ProfileProps): JSX.Element {
  const [isEditing, setIsEditing] = useState(false);

  const {
    profileUI: {
      showAbout,
      showCerts,
      showDonation,
      showHeatMap,
      showLocation,
      showName,
      showPoints,
      showPortfolio,
      showTimeLine,
      showCareer
    },
    calendar,
    completedChallenges,
    githubProfile,
    linkedin,
    twitter,
    website,
    name,
    username,
    joinDate,
    location,
    points,
    picture,
    portfolio,
    about,
    yearsTopContributor,
    isDonating,
    career
  } = user;

  return (
    <>
      {isSessionUser && (
        <EditModal
          user={user}
          isEditing={isEditing}
          isSessionUser={isSessionUser}
          setIsEditing={setIsEditing}
          updateMyPortfolio={updateMyPortfolio}
          updateMySocials={updateMySocials}
          submitNewAbout={submitNewAbout}
        />
      )}
      <Camper
        about={showAbout ? about : ''}
        githubProfile={githubProfile}
        isDonating={showDonation ? isDonating : false}
        joinDate={showAbout ? joinDate : ''}
        linkedin={linkedin}
        location={showLocation ? location : ''}
        name={showName ? name : ''}
        picture={picture}
        twitter={twitter}
        username={username}
        website={website}
        yearsTopContributor={yearsTopContributor}
        isSessionUser={isSessionUser}
        setIsEditing={setIsEditing}
      />
      {showPoints ? <Stats points={points} calendar={calendar} /> : null}
      {showHeatMap ? <HeatMap calendar={calendar} /> : null}
      {showCareer ? (
        <CareerTimeline
          career={career}
          isSessionUser={isSessionUser}
          updateMyCareer={updateMyCareer}
        />
      ) : null}
      {showPortfolio ? (
        <PortfolioProjects portfolioProjects={portfolio} />
      ) : null}
      {showCerts ? <Certifications username={username} /> : null}
      {showTimeLine ? (
        <Timeline completedMap={completedChallenges} username={username} />
      ) : null}
      <Spacer size='m' />
    </>
  );
}

function Profile({
  user,
  isSessionUser,
  updateMyPortfolio,
  updateMySocials,
  updateMyCareer,
  submitNewAbout
}: ProfileProps): JSX.Element {
  const { t } = useTranslation();
  const {
    profileUI: { isLocked },
    username
  } = user;

  const showUserProfile = !isLocked || isSessionUser;

  return (
    <>
      <Helmet>
        <title>{t('buttons.profile')} | freeCodeCamp.org</title>
      </Helmet>
      <Spacer size='m' />
      <Container>
        <Spacer size='m' />
        {isLocked && (
          <Message username={username} isSessionUser={isSessionUser} t={t} />
        )}
        {showUserProfile && (
          <UserProfile
            user={user}
            isSessionUser={isSessionUser}
            updateMyPortfolio={updateMyPortfolio}
            updateMyCareer={updateMyCareer}
            updateMySocials={updateMySocials}
            submitNewAbout={submitNewAbout}
          />
        )}
        {!isSessionUser && (
          <Row className='text-center'>
            <Link to={`/user/${username}/report-user`}>
              {t('buttons.flag-user')}
            </Link>
          </Row>
        )}
        <Spacer size='m' />
      </Container>
    </>
  );
}

Profile.displayName = 'Profile';

export default Profile;
