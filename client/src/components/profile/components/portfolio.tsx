import { findIndex, find, isEqual } from 'lodash-es';
import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import type { TFunction } from 'i18next';
import {
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock,
  FormGroupProps,
  Button,
  Spacer
} from '@freecodecamp/ui';
import { withTranslation } from 'react-i18next';
import isURL from 'validator/lib/isURL';
import { connect } from 'react-redux';
import { PortfolioProjectData } from '../../../redux/prop-types';

import { hasProtocolRE } from '../../../utils';

import { FullWidthRow } from '../../helpers';
import BlockSaveButton from '../../helpers/form/block-save-button';
import SectionHeader from '../../settings/section-header';
import { updateMyPortfolio } from '../../../redux/settings/actions';

type PortfolioProps = {
  picture?: string;
  portfolio: PortfolioProjectData[];
  t: TFunction;
  updateMyPortfolio: (obj: { portfolio: PortfolioProjectData[] }) => void;
  username?: string;
  setIsEditing: (isEditing: boolean) => void;
};

interface ProfileValidation {
  state: FormGroupProps['validationState'];
  message: string;
}

const mapDispatchToProps: {
  updateMyPortfolio: () => void;
} = {
  updateMyPortfolio
};

function createEmptyPortfolioItem(): PortfolioProjectData {
  return {
    id: nanoid(),
    title: '',
    description: '',
    url: '',
    image: ''
  };
}

function createFindById(id: string) {
  return (p: PortfolioProjectData) => p.id === id;
}

const PortfolioSettings = (props: PortfolioProps) => {
  const {
    t,
    portfolio: initialPortfolio = [],
    setIsEditing,
    updateMyPortfolio
  } = props;
  const [portfolio, setPortfolio] = useState(initialPortfolio);
  const [unsavedItemId, setUnsavedItemId] = useState<string | null>(null);
  const [imageValidation, setImageValid] = useState<ProfileValidation>({
    state: 'success',
    message: ''
  });

  const checkIfValidImage = (url: string): Promise<ProfileValidation> => {
    const img = new Image();

    return new Promise(resolve => {
      img.onerror = () =>
        resolve({ state: 'error', message: t('validation.url-not-image') });
      img.onload = () => resolve({ state: 'success', message: '' });
      img.src = url;
    });
  };

  const createOnChangeHandler =
    (id: string, key: 'description' | 'image' | 'title' | 'url') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const userInput = e.target.value.slice();
      setPortfolio(prevPortfolio => {
        const mutablePortfolio = [...prevPortfolio];
        const index = findIndex(prevPortfolio, p => p.id === id);
        mutablePortfolio[index] = {
          ...mutablePortfolio[index],
          [key]: userInput
        };
        if (key === 'image' && userInput) {
          void checkIfValidImage(userInput).then(imageValidation => {
            setImageValid(imageValidation);
          });
        } else if (key === 'image' && !userInput) {
          setImageValid({ state: 'success', message: '' });
        }
        return mutablePortfolio;
      });
    };

  const updateItem = (
    id: string,
    updatedPortfolio?: PortfolioProjectData[]
  ) => {
    if (unsavedItemId === id) {
      setUnsavedItemId(null);
    }
    const portfolioToUpdate = updatedPortfolio || portfolio;
    updateMyPortfolio({ portfolio: portfolioToUpdate });
    setIsEditing(false);
  };

  const handleAdd = () => {
    const item = createEmptyPortfolioItem();
    setPortfolio(prev => [item, ...prev]);
    setUnsavedItemId(item.id);
  };

  const handleRemoveItem = (id: string) => {
    const newPortfolio = portfolio.filter(p => p.id !== id);
    setPortfolio(newPortfolio);
    updateItem(id, newPortfolio);
    setIsEditing(false);
  };

  const isFormPristine = (id: string) => {
    const original = find(props.portfolio, createFindById(id));
    if (!original) {
      return false;
    }
    const edited = find(portfolio, createFindById(id));
    return isEqual(original, edited);
  };

  const getDescriptionValidation = (description: string): ProfileValidation => {
    const len = description.length;
    const charsLeft = 288 - len;
    if (charsLeft < 0) {
      return {
        state: 'error',
        message: t('validation.max-characters', { charsLeft: 0 })
      };
    }
    if (charsLeft < 41 && charsLeft > 0) {
      return {
        state: 'warning',
        message: t('validation.max-characters', { charsLeft })
      };
    }
    if (charsLeft === 288) {
      return { state: null, message: '' };
    }
    return { state: 'success', message: '' };
  };

  const getTitleValidation = (title: string): ProfileValidation => {
    if (!title) {
      return { state: 'error', message: t('validation.title-required') };
    }
    const len = title.length;
    if (len < 2) {
      return { state: 'error', message: t('validation.title-short') };
    }
    if (len > 144) {
      return { state: 'error', message: t('validation.title-long') };
    }
    return { state: 'success', message: '' };
  };

  const getUrlValidation = (
    url: string
  ): { state: 'success' | 'warning' | 'error'; message: string } => {
    const len = url.length;
    if (!url) {
      return { state: 'success', message: '' };
    }
    if (len >= 4 && !hasProtocolRE.test(url)) {
      return { state: 'error', message: t('validation.invalid-protocol') };
    }
    return isURL(url)
      ? { state: 'success', message: '' }
      : { state: 'warning', message: t('validation.use-valid-url') };
  };

  const formCorrect = (portfolioItem: PortfolioProjectData) => {
    const { id, title, description, url, image } = portfolioItem;
    const { state: titleState, message: titleMessage } =
      getTitleValidation(title);
    const { state: urlState, message: urlMessage } = getUrlValidation(url);
    const { state: descriptionState, message: descriptionMessage } =
      getDescriptionValidation(description);
    const { state: imageState, message: imageMessage } =
      getUrlValidation(image);
    const pristine = isFormPristine(id);
    const urlIsValid = !isURL(url, {
      protocols: ['http', 'https'],
      require_tld: true,
      require_protocol: true
    });
    const isButtonDisabled = [
      titleState,
      urlState,
      descriptionState,
      imageState,
      urlIsValid
    ].some(state => state === 'error' || false);
    return {
      isButtonDisabled,
      title: { titleState, titleMessage },
      url: { urlState, urlMessage },
      image: { imageState, imageMessage },
      desc: { descriptionState, descriptionMessage },
      pristine
    };
  };

  const renderPortfolio = (
    portfolioItem: PortfolioProjectData,
    index: number,
    arr: PortfolioProjectData[]
  ) => {
    const { id, title, description, url, image } = portfolioItem;
    const {
      isButtonDisabled,
      title: { titleState, titleMessage },
      url: { urlState, urlMessage },
      image: { imageState, imageMessage },
      desc: { descriptionState, descriptionMessage },
      pristine
    } = formCorrect(portfolioItem);
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>, id: string) => {
      e.preventDefault();
      if (isButtonDisabled) return null;
      setIsEditing(false);
      return updateItem(id);
    };
    const combineImageStatus =
      imageState === 'success' && imageValidation.state === 'success'
        ? null
        : 'error';
    const combineImageMessage = imageMessage || imageValidation.message;
    return (
      <FullWidthRow key={id}>
        <form
          onSubmit={e => handleSubmit(e, id)}
          id='portfolio-items'
          data-playwright-test-label='portfolio-items'
        >
          <FormGroup
            controlId={`${id}-title`}
            validationState={
              pristine || (!pristine && !title) ? null : titleState
            }
          >
            <ControlLabel htmlFor={`${id}-title-input`}>
              {t('settings.labels.title')}
            </ControlLabel>
            <FormControl
              onChange={createOnChangeHandler(id, 'title')}
              required
              type='text'
              value={title}
              name='portfolio-title'
              id={`${id}-title-input`}
            />
            {titleMessage ? (
              <HelpBlock data-playwright-test-label='title-validation'>
                {titleMessage}
              </HelpBlock>
            ) : null}
          </FormGroup>
          <FormGroup
            controlId={`${id}-url`}
            validationState={pristine || (!pristine && !url) ? null : urlState}
          >
            <ControlLabel htmlFor={`${id}-url-input`}>
              {t('settings.labels.url')}
            </ControlLabel>
            <FormControl
              onChange={createOnChangeHandler(id, 'url')}
              required
              type='url'
              value={url}
              name='portfolio-url'
              id={`${id}-url-input`}
            />
            {urlMessage ? (
              <HelpBlock data-playwright-test-label='url-validation'>
                {urlMessage}
              </HelpBlock>
            ) : null}
          </FormGroup>
          <FormGroup
            controlId={`${id}-image`}
            validationState={pristine ? null : combineImageStatus}
          >
            <ControlLabel htmlFor={`${id}-image-input`}>
              {t('settings.labels.image')}
            </ControlLabel>
            <FormControl
              onChange={createOnChangeHandler(id, 'image')}
              type='url'
              value={image}
              name='portfolio-image'
              id={`${id}-image-input`}
            />
            {combineImageMessage ? (
              <HelpBlock data-playwright-test-label='image-validation'>
                {combineImageMessage}
              </HelpBlock>
            ) : null}
          </FormGroup>
          <FormGroup
            controlId={`${id}-description`}
            validationState={pristine ? null : descriptionState}
          >
            <ControlLabel htmlFor={`${id}-description-input`}>
              {t('settings.labels.description')}
            </ControlLabel>
            <FormControl
              componentClass='textarea'
              onChange={createOnChangeHandler(id, 'description')}
              value={description}
              name='portfolio-description'
              id={`${id}-description-input`}
            />
            {descriptionMessage ? (
              <HelpBlock data-playwright-test-label='description-validation'>
                {descriptionMessage}
              </HelpBlock>
            ) : null}
          </FormGroup>
          <BlockSaveButton
            disabled={isButtonDisabled}
            bgSize='large'
            data-playwright-test-label='save-portfolio'
            {...(isButtonDisabled && { tabIndex: -1 })}
          >
            {t('buttons.save-portfolio')}
          </BlockSaveButton>
          <Spacer size='xs' />
          <Button
            block
            size='large'
            variant='danger'
            onClick={() => handleRemoveItem(id)}
            type='button'
          >
            {t('buttons.remove-portfolio')}
          </Button>
        </form>
        {index + 1 !== arr.length && (
          <>
            <Spacer size='m' />
            <hr />
            <Spacer size='m' />
          </>
        )}
      </FullWidthRow>
    );
  };

  return (
    <section id='portfolio-settings'>
      <SectionHeader>{t('settings.headings.portfolio')}</SectionHeader>
      <FullWidthRow>
        <p>{t('settings.share-projects')}</p>
        <Spacer size='xs' />
        <Button
          block
          size='large'
          variant='primary'
          disabled={unsavedItemId !== null}
          onClick={handleAdd}
          type='button'
        >
          {t('buttons.add-portfolio')}
        </Button>
      </FullWidthRow>
      <Spacer size='l' />
      {portfolio.length ? portfolio.map(renderPortfolio) : null}
    </section>
  );
};

PortfolioSettings.displayName = 'PortfolioSettings';

export default withTranslation()(
  connect(null, mapDispatchToProps)(PortfolioSettings)
);
