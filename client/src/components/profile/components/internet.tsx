import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import type { TFunction } from 'i18next';
import { withTranslation } from 'react-i18next';
import isURL from 'validator/lib/isURL';
import {
  FormControl,
  FormGroup,
  ControlLabel,
  HelpBlock,
  type FormGroupProps
} from '@freecodecamp/ui';

import { connect } from 'react-redux';
import { maybeUrlRE } from '../../../utils';

import { FullWidthRow } from '../../helpers';
import BlockSaveButton from '../../helpers/form/block-save-button';
import SectionHeader from '../../settings/section-header';
import { User } from '../../../redux/prop-types';
import { updateMySocials } from '../../../redux/settings/actions';

export interface Socials {
  githubProfile: string;
  linkedin: string;
  twitter: string;
  website: string;
}

interface InternetProps {
  user: User;
  t: TFunction;
  updateMySocials: (formValues: Socials) => void;
  setIsEditing: (isEditing: boolean) => void;
}

interface URLValidation {
  state: FormGroupProps['validationState'];
  message: string;
}

function Info({ message }: { message: string }) {
  return message ? <HelpBlock>{message}</HelpBlock> : null;
}

const mapDispatchToProps: {
  updateMySocials: (formValues: Socials) => void;
} = {
  updateMySocials
};

const InternetSettings = ({
  user,
  t,
  updateMySocials,
  setIsEditing
}: InternetProps) => {
  const {
    githubProfile = '',
    linkedin = '',
    twitter = '',
    website = ''
  } = user;

  const [formValues, setFormValues] = useState<Socials>({
    githubProfile,
    linkedin,
    twitter,
    website
  });

  const getValidationStateFor = (maybeURl = ''): URLValidation => {
    if (!maybeURl || !maybeUrlRE.test(maybeURl)) {
      return {
        state: null,
        message: ''
      };
    }
    if (isURL(maybeURl)) {
      return {
        state: 'success',
        message: ''
      };
    }
    return {
      state: 'error',
      message: t('validation.invalid-url')
    };
  };

  const createHandleChange =
    (key: keyof Socials) => (e: React.FormEvent<HTMLInputElement>) => {
      const value = (e.target as HTMLInputElement).value.slice(0);
      setFormValues({
        ...formValues,
        [key]: value
      });
    };

  const isFormPristine = () => {
    const originalValues = { githubProfile, linkedin, twitter, website };

    return (Object.keys(originalValues) as Array<keyof Socials>).every(
      key => originalValues[key] === formValues[key]
    );
  };

  const isFormValid = (): boolean =>
    Object.values(formValues).every(
      (value: string) => value === '' || isURL(value)
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormPristine() && isFormValid()) {
      // Only submit the form if is has changed, and if it is valid
      updateMySocials({ ...formValues });
    }
    setIsEditing(false);
  };

  const {
    state: githubProfileValidation,
    message: githubProfileValidationMessage
  } = getValidationStateFor(formValues.githubProfile);

  const { state: linkedinValidation, message: linkedinValidationMessage } =
    getValidationStateFor(formValues.linkedin);

  const { state: twitterValidation, message: twitterValidationMessage } =
    getValidationStateFor(formValues.twitter);

  const { state: websiteValidation, message: websiteValidationMessage } =
    getValidationStateFor(formValues.website);
  const isDisabled = isFormPristine() || !isFormValid();

  return (
    <>
      <SectionHeader>{t('settings.headings.internet')}</SectionHeader>
      <FullWidthRow>
        <form
          id='internet-presence'
          onSubmit={handleSubmit}
          data-playwright-test-label='internet-presence'
        >
          <div role='group' aria-label={t('settings.headings.internet')}>
            <FormGroup
              controlId='internet-github'
              validationState={githubProfileValidation}
            >
              <ControlLabel htmlFor='internet-github-input'>
                GitHub
              </ControlLabel>
              <FormControl
                data-playwright-test-label='internet-github-input'
                onChange={createHandleChange('githubProfile')}
                placeholder='https://github.com/user-name'
                type='url'
                value={formValues.githubProfile}
                id='internet-github-input'
              />
              <Check
                url={formValues.githubProfile}
                validation={githubProfileValidation}
                dataPlaywrightTestLabel='internet-github-check'
              />
              <Info message={githubProfileValidationMessage} />
            </FormGroup>
            <FormGroup
              controlId='internet-linkedin'
              validationState={linkedinValidation}
            >
              <ControlLabel htmlFor='internet-linkedin-input'>
                LinkedIn
              </ControlLabel>
              <FormControl
                onChange={createHandleChange('linkedin')}
                placeholder='https://www.linkedin.com/in/user-name'
                type='url'
                value={formValues.linkedin}
                id='internet-linkedin-input'
              />
              <Check
                url={formValues.linkedin}
                validation={linkedinValidation}
                dataPlaywrightTestLabel='internet-linkedin-check'
              />
              <Info message={linkedinValidationMessage} />
            </FormGroup>
            <FormGroup
              controlId='internet-twitter'
              validationState={twitterValidation}
            >
              <ControlLabel htmlFor='internet-twitter-input'>
                Twitter
              </ControlLabel>
              <FormControl
                onChange={createHandleChange('twitter')}
                placeholder='https://twitter.com/user-name'
                type='url'
                value={formValues.twitter}
                id='internet-twitter-input'
              />
              <Check
                url={formValues.twitter}
                validation={twitterValidation}
                dataPlaywrightTestLabel='internet-twitter-check'
              />
              <Info message={twitterValidationMessage} />
            </FormGroup>
            <FormGroup
              controlId='internet-website'
              validationState={websiteValidation}
            >
              <ControlLabel htmlFor='internet-website-input'>
                {t('settings.labels.personal')}
              </ControlLabel>
              <FormControl
                onChange={createHandleChange('website')}
                placeholder='https://example.com'
                type='url'
                value={formValues.website}
                id='internet-website-input'
              />

              <Check
                url={formValues.website}
                validation={websiteValidation}
                dataPlaywrightTestLabel='internet-website-check'
              />

              <Info message={websiteValidationMessage} />
            </FormGroup>
          </div>
          <BlockSaveButton
            disabled={isDisabled}
            bgSize='large'
            {...(isDisabled && { tabIndex: -1 })}
          >
            {t('buttons.save')}{' '}
            <span className='sr-only'>{t('settings.headings.internet')}</span>
          </BlockSaveButton>
        </form>
      </FullWidthRow>
    </>
  );
};

const Check = ({
  url,
  validation,
  dataPlaywrightTestLabel
}: {
  url: string;
  validation: URLValidation['state'];
  dataPlaywrightTestLabel: string;
}) =>
  url && validation === 'success' ? (
    <FormControl.Feedback>
      <span>
        <FontAwesomeIcon
          data-playwright-test-label={dataPlaywrightTestLabel}
          icon={faCheck}
          size='1x'
        />
      </span>
    </FormControl.Feedback>
  ) : null;

InternetSettings.displayName = 'InternetSettings';

export default withTranslation()(
  connect(null, mapDispatchToProps)(InternetSettings)
);
