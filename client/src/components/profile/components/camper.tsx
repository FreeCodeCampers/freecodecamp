import React from 'react';
import { useTranslation } from 'react-i18next';
import type { User } from '../../../redux/prop-types';
import { FullWidthRow } from '../../helpers';
import './camper.css';
import SupporterBadgeEmblem from '../../../assets/icons/supporter-badge-emblem';
import TopContibutorBadgeEmblem from '../../../assets/icons/top-contributor-badge-emblem';
import Bio from './bio';

export type CamperProps = {
  user: User;
  setIsEditing: (value: boolean) => void;
  isSessionUser: boolean;
};

function Camper({
  user,
  isSessionUser,
  setIsEditing
}: CamperProps): JSX.Element {
  const {
    isDonating,
    yearsTopContributor,
    profileUI: { showDonation }
  } = user;

  const { t } = useTranslation();
  const isTopContributor = yearsTopContributor.filter(Boolean).length > 0;
  return (
    <>
      <div className='bio-container'>
        <Bio
          user={user}
          setIsEditing={setIsEditing}
          isSessionUser={isSessionUser}
        />
      </div>
      {((isDonating && showDonation) || isTopContributor) && (
        <FullWidthRow>
          <section className='card'>
            <h2>{t('profile.badges')}</h2>
            <div className='badge-card-container'>
              {isDonating && (
                <div className='badge-card'>
                  <div className='camper-badge'>
                    <SupporterBadgeEmblem />
                  </div>
                  <div className='badge-card-description'>
                    <h3>{t('profile.supporter')}</h3>
                    <p>{t('profile.donated')}</p>
                  </div>
                </div>
              )}
              {isTopContributor && (
                <div className='badge-card'>
                  <div className='camper-badge'>
                    <TopContibutorBadgeEmblem />
                  </div>
                  <div className='badge-card-description'>
                    <h3>{t('profile.contributor')}</h3>
                    <p>
                      {t('profile.contributor-prolific', {
                        year: yearsTopContributor.join(', ')
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </FullWidthRow>
      )}
    </>
  );
}

Camper.displayName = 'Camper';

export default Camper;
