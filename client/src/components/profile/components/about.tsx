import React, { useEffect, useState } from 'react';
import {
  FormGroup,
  FormControl,
  HelpBlock,
  Alert,
  ControlLabel
} from '@freecodecamp/ui';
import type { TFunction } from 'i18next';
import { withTranslation } from 'react-i18next';
import isURL from 'validator/lib/isURL';

import { connect } from 'react-redux';
import { FullWidthRow } from '../../helpers';
import BlockSaveButton from '../../helpers/form/block-save-button';
import SectionHeader from '../../settings/section-header';
import { User } from '../../../redux/prop-types';
import { submitNewAbout } from '../../../redux/settings/actions';

type AboutProps = {
  user: User;
  t: TFunction;
  submitNewAbout: (formValues: FormValues) => void;
  setIsEditing: (isEditing: boolean) => void;
};

type FormValues = {
  name: string;
  location: string;
  picture: string;
  about: string;
};

const mapDispatchToProps: {
  submitNewAbout: () => void;
} = {
  submitNewAbout
};

const ShowImageValidationWarning = ({
  alertContent
}: {
  alertContent: string;
}) => {
  return (
    <HelpBlock>
      <Alert variant='info'>{alertContent}</Alert>
    </HelpBlock>
  );
};

const AboutSettings = ({
  user,
  t,
  submitNewAbout,
  setIsEditing
}: AboutProps) => {
  const { name = '', location = '', picture = '', about = '' } = user;

  const [formValues, setFormValues] = useState<FormValues>({
    name,
    location,
    picture,
    about
  });
  const [originalValues, setOriginalValues] = useState<FormValues>({
    name,
    location,
    picture,
    about
  });
  const [formClicked, setFormClicked] = useState(false);
  const [isPictureUrlValid, setIsPictureUrlValid] = useState(true);

  const checkIfValidImage = (url: string) => {
    const img = new Image();

    return new Promise(resolve => {
      img.onerror = () => resolve(false);
      img.onload = () => resolve(true);
      img.src = url;
    });
  };

  useEffect(() => {
    if (
      formClicked &&
      name === formValues.name &&
      location === formValues.location &&
      picture === formValues.picture &&
      about === formValues.about
    ) {
      setOriginalValues({
        name,
        location,
        picture,
        about
      });
      setFormClicked(false);
    }
  }, [formClicked, name, location, picture, about, formValues]);

  const isFormPristine = () => {
    return (
      isPictureUrlValid === false ||
      (Object.keys(originalValues) as Array<keyof FormValues>)
        .map(key => originalValues[key] === formValues[key])
        .every(bool => bool)
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPictureUrlValid === true && !isFormPristine()) {
      setIsEditing(false);
      setFormClicked(true);
      submitNewAbout(formValues);
    } else {
      setIsEditing(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0);
    setFormValues(state => ({
      ...state,
      name: value
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0);
    setFormValues(state => ({
      ...state,
      location: value
    }));
  };

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0);
    if (!value) {
      setIsPictureUrlValid(true);
    } else if (isURL(value, { require_protocol: true })) {
      void checkIfValidImage(value).then(isValid => {
        setIsPictureUrlValid(isValid as boolean);
      });
    } else {
      setIsPictureUrlValid(false);
    }
    setFormValues(state => ({
      ...state,
      picture: value
    }));
  };

  const handleAboutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0);
    setFormValues(state => ({
      ...state,
      about: value
    }));
  };

  return (
    <>
      <SectionHeader>{t('settings.headings.personal-info')}</SectionHeader>
      <FullWidthRow>
        <form
          id='camper-identity'
          onSubmit={handleSubmit}
          data-playwright-test-label='camper-identity'
        >
          <div role='group' aria-label={t('settings.headings.personal-info')}>
            <FormGroup controlId='about-name'>
              <ControlLabel htmlFor='about-name-input'>
                <strong>{t('settings.labels.name')}</strong>
              </ControlLabel>
              <FormControl
                onChange={handleNameChange}
                type='text'
                value={formValues.name}
                id='about-name-input'
              />
            </FormGroup>
            <FormGroup controlId='about-location'>
              <ControlLabel htmlFor='about-location-input'>
                <strong>{t('settings.labels.location')}</strong>
              </ControlLabel>
              <FormControl
                onChange={handleLocationChange}
                type='text'
                value={formValues.location}
                id='about-location-input'
              />
            </FormGroup>
            <FormGroup controlId='about-picture'>
              <ControlLabel htmlFor='about-picture-input'>
                <strong>{t('settings.labels.picture')}</strong>
              </ControlLabel>
              <FormControl
                onChange={handlePictureChange}
                type='url'
                value={formValues.picture}
                id='about-picture-input'
              />
              {!isPictureUrlValid && (
                <ShowImageValidationWarning
                  alertContent={t('validation.url-not-image')}
                />
              )}
            </FormGroup>
            <FormGroup controlId='about-about'>
              <ControlLabel htmlFor='about-about-input'>
                <strong>{t('settings.labels.about')}</strong>
              </ControlLabel>
              <FormControl
                componentClass='textarea'
                onChange={handleAboutChange}
                value={formValues.about}
                id='about-about-input'
              />
            </FormGroup>
          </div>
          <BlockSaveButton
            disabled={isFormPristine()}
            bgSize='large'
            {...(isFormPristine() && { tabIndex: -1 })}
          >
            {t('buttons.save')}{' '}
            <span className='sr-only'>
              {t('settings.headings.personal-info')}
            </span>
          </BlockSaveButton>
        </form>
      </FullWidthRow>
    </>
  );
};

AboutSettings.displayName = 'AboutSettings';

export default withTranslation()(
  connect(null, mapDispatchToProps)(AboutSettings)
);
