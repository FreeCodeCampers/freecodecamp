import React, { useState } from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Dispatch } from 'redux';
import { createSelector } from 'reselect';
import { Button, Spacer } from '@freecodecamp/ui';

import { userSelector } from '../../redux/selectors';
import type { ProfileUI } from '../../redux/prop-types';
import { submitProfileUI } from '../../redux/settings/actions';

import FullWidthRow from '../helpers/full-width-row';
import SectionHeader from './section-header';
import ToggleRadioSetting from './toggle-radio-setting';

const mapStateToProps = createSelector(userSelector, user => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  user
}));

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ submitProfileUI }, dispatch);

type PrivacyProps = {
  submitProfileUI: (profileUI: ProfileUI) => void;
  user: {
    profileUI: ProfileUI;
    username: string;
  };
};

function PrivacySettings({ submitProfileUI, user }: PrivacyProps): JSX.Element {
  const { t } = useTranslation();
  const [privacyValues, setPrivacyValues] = useState({ ...user.profileUI });

  const [madeChanges, setMadeChanges] = useState(false);

  function toggleFlag(flag: keyof ProfileUI): () => void {
    return () => {
      setMadeChanges(true);
      setPrivacyValues({ ...privacyValues, [flag]: !privacyValues[flag] });
    };
  }

  function submitNewProfileSettings(e: React.FormEvent) {
    e.preventDefault();
    if (!madeChanges) return;
    submitProfileUI(privacyValues);
    setMadeChanges(false);
  }

  return (
    <div className='privacy-settings' id='privacy-settings'>
      <SectionHeader>{t('settings.headings.privacy')}</SectionHeader>
      <FullWidthRow>
        <p>{t('settings.privacy')}</p>
        <form onSubmit={submitNewProfileSettings}>
          <div role='group' aria-label={t('settings.headings.privacy')}>
            <ToggleRadioSetting
              action={t('settings.labels.my-profile')}
              explain={t('settings.disabled')}
              flag={privacyValues['isLocked']}
              flagName='isLocked'
              offLabel={t('buttons.public')}
              onLabel={t('buttons.private')}
              toggleFlag={toggleFlag('isLocked')}
            />
            <ToggleRadioSetting
              action={t('settings.labels.my-name')}
              explain={t('settings.private-name')}
              flag={!privacyValues['showName']}
              flagName='name'
              offLabel={t('buttons.public')}
              onLabel={t('buttons.private')}
              toggleFlag={toggleFlag('showName')}
            />
            <ToggleRadioSetting
              action={t('settings.labels.my-location')}
              flag={!privacyValues['showLocation']}
              flagName='showLocation'
              offLabel={t('buttons.public')}
              onLabel={t('buttons.private')}
              toggleFlag={toggleFlag('showLocation')}
            />
            <ToggleRadioSetting
              action={t('settings.labels.my-about')}
              flag={!privacyValues['showAbout']}
              flagName='showAbout'
              offLabel={t('buttons.public')}
              onLabel={t('buttons.private')}
              toggleFlag={toggleFlag('showAbout')}
            />
            <ToggleRadioSetting
              action={t('settings.labels.my-points')}
              flag={!privacyValues['showPoints']}
              flagName='showPoints'
              offLabel={t('buttons.public')}
              onLabel={t('buttons.private')}
              toggleFlag={toggleFlag('showPoints')}
            />
            <ToggleRadioSetting
              action={t('settings.labels.my-heatmap')}
              flag={!privacyValues['showHeatMap']}
              flagName='showHeatMap'
              offLabel={t('buttons.public')}
              onLabel={t('buttons.private')}
              toggleFlag={toggleFlag('showHeatMap')}
            />
            <ToggleRadioSetting
              action={t('settings.labels.my-certs')}
              explain={t('settings.disabled')}
              flag={!privacyValues['showCerts']}
              flagName='showCerts'
              offLabel={t('buttons.public')}
              onLabel={t('buttons.private')}
              toggleFlag={toggleFlag('showCerts')}
            />
            <ToggleRadioSetting
              action={t('settings.labels.my-portfolio')}
              flag={!privacyValues['showPortfolio']}
              flagName='showPortfolio'
              offLabel={t('buttons.public')}
              onLabel={t('buttons.private')}
              toggleFlag={toggleFlag('showPortfolio')}
            />
            <ToggleRadioSetting
              action={t('settings.labels.my-timeline')}
              explain={t('settings.disabled')}
              flag={!privacyValues['showTimeLine']}
              flagName='showTimeLine'
              offLabel={t('buttons.public')}
              onLabel={t('buttons.private')}
              toggleFlag={toggleFlag('showTimeLine')}
            />
            <ToggleRadioSetting
              action={t('settings.labels.my-experience')}
              flag={!privacyValues['showCareer']}
              flagName='showCareer'
              offLabel={t('buttons.public')}
              onLabel={t('buttons.private')}
              toggleFlag={toggleFlag('showCareer')}
            />
            <ToggleRadioSetting
              action={t('settings.labels.my-donations')}
              flag={!privacyValues['showDonation']}
              flagName='showDonation'
              offLabel={t('buttons.public')}
              onLabel={t('buttons.private')}
              toggleFlag={toggleFlag('showDonation')}
            />
          </div>
          <Button
            type='submit'
            size='large'
            variant='primary'
            block={true}
            disabled={!madeChanges}
            {...(!madeChanges && { tabIndex: -1 })}
          >
            {t('buttons.save')}{' '}
            <span className='sr-only'>{t('settings.headings.privacy')}</span>
          </Button>
        </form>
      </FullWidthRow>
      <FullWidthRow>
        <Spacer size='m' />
        <p>{t('settings.data')}</p>
        <Button
          block={true}
          size='large'
          variant='primary'
          download={`${user.username}.json`}
          href={`data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(user)
          )}`}
        >
          {t('buttons.download-data')}
        </Button>
      </FullWidthRow>
    </div>
  );
}

PrivacySettings.displayName = 'PrivacySettings';

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(PrivacySettings));
