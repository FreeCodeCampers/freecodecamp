import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useFeature } from '@growthbook/growthbook-react';
import { Col, Row, Modal, Spacer } from '@freecodecamp/ui';
import { closeDonationModal } from '../../redux/actions';
import { PaymentContext } from '../../../../shared/config/donation-settings';
import { SuperBlocks } from '../../../../shared/config/curriculum';
import donationAnimation from '../../assets/images/donation-bear-animation.svg';
import donationAnimationB from '../../assets/images/new-bear-animation.svg';
import supporterBear from '../../assets/images/supporter-bear.svg';
import callGA from '../../analytics/call-ga';
import MultiTierDonationForm from './multi-tier-donation-form';
import { ModalBenefitList } from './donation-text-components';

type RecentlyClaimedBlock = null | { block: string; superBlock: SuperBlocks };
type RecentlyClaimedModule = null | { module: string; superBlock: SuperBlocks };

type DonationModalBodyProps = {
  activeDonors?: number;
  closeDonationModal: typeof closeDonationModal;
  recentlyClaimedBlock: RecentlyClaimedBlock;
  recentlyClaimedModule: RecentlyClaimedModule;
  setCanClose: (canClose: boolean) => void;
};

const Illustration = () => {
  const { t } = useTranslation();
  return (
    <img
      alt={t('donate.flying-bear')}
      id={'supporter-bear'}
      src={supporterBear}
    />
  );
};

function ModalHeader({
  recentlyClaimedBlock,
  recentlyClaimedModule,
  showHeaderAndFooter,
  donationAttempted,
  showForm
}: {
  recentlyClaimedBlock: RecentlyClaimedBlock;
  recentlyClaimedModule: RecentlyClaimedModule;
  showHeaderAndFooter: boolean;
  donationAttempted: boolean;
  showForm: boolean;
}) {
  const { t } = useTranslation();

  if (!showHeaderAndFooter || donationAttempted) {
    return null;
  } else if (!showForm) {
    return (
      <Row className='text-center'>
        <Col sm={10} smOffset={1} xs={12}>
          {recentlyClaimedBlock &&
            recentlyClaimedBlock.superBlock !==
              SuperBlocks.FullStackDeveloper && (
              <>
                <b>
                  {t('donate.nicely-done', {
                    block: t(
                      `intro:${recentlyClaimedBlock.superBlock}.blocks.${recentlyClaimedBlock.block}.title`
                    )
                  })}
                </b>
                <Spacer size='xs' />
              </>
            )}

          {recentlyClaimedModule &&
            recentlyClaimedModule.superBlock ===
              SuperBlocks.FullStackDeveloper && (
              <>
                <b>
                  {t('donate.nicely-done', {
                    block: t(
                      `intro:${recentlyClaimedModule.superBlock}.modules.${recentlyClaimedModule.module}`
                    )
                  })}
                </b>
                <Spacer size='xs' />
              </>
            )}

          <Modal.Header showCloseButton={false} borderless>
            {t('donate.modal-benefits-title')}
          </Modal.Header>
        </Col>
      </Row>
    );
  } else {
    return null;
  }
}

function CloseButtonRow({
  donationAttempted,
  closeDonationModal
}: {
  donationAttempted: boolean;
  closeDonationModal: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Row>
      <Col sm={4} smOffset={4} xs={8} xsOffset={2}>
        <button
          className='close-button'
          type='button'
          onClick={closeDonationModal}
        >
          {donationAttempted ? t('buttons.close') : t('buttons.ask-later')}
        </button>
      </Col>
    </Row>
  );
}

const Benefits = ({ setShowForm }: { setShowForm: (arg: boolean) => void }) => {
  const { t } = useTranslation();
  const handleBecomeSupporterClick = () => {
    callGA({
      event: 'donation_related',
      action: `Modal Become Supporter Click`
    });
    setShowForm(true);
  };
  return (
    <Row className={'donate-btn-group'}>
      <Col xs={12}>
        <ModalBenefitList />
        <Spacer size='xs' />
        <button
          className='text-center confirm-donation-btn donate-btn-group'
          type='submit'
          onClick={handleBecomeSupporterClick}
        >
          {t('donate.become-supporter')}
        </button>
        <Spacer size='m' />
      </Col>
    </Row>
  );
};

const AnimationContainer = ({
  secondsRemaining
}: {
  secondsRemaining: number;
}) => {
  const animationKey = useRef(Date.now()).current;
  const newBearAnimation = useFeature('new-bear-animation').on;
  const animationSrc = `${newBearAnimation ? donationAnimationB : donationAnimation}?t=${animationKey}`;
  const { t } = useTranslation();
  return (
    <>
      <div style={{ opacity: 0, position: 'absolute' }}>
        <p>{t('donate.animation-description')}</p>
        <span aria-live='polite'>
          {t('donate.animation-countdown', { secondsRemaining })}
        </span>
      </div>
      <div className='donation-animation-container' aria-hidden='true'>
        <div className='donation-animation-bullet-points'>
          {newBearAnimation ? (
            <>
              <p className='donation-animation-bullet-1-b'>
                {t('donate.become-supporter')}
              </p>
              <p className='donation-animation-bullet-2-b'>
                {t('donate.remove-interruptions')}
              </p>
              <p className='donation-animation-bullet-3-b'>
                {t('donate.acquire-skills-faster')}
              </p>
              <p className='donation-animation-bullet-4-b'>
                {t('donate.help-millions-learn')}
              </p>
            </>
          ) : (
            <>
              <p className='donation-animation-bullet-1'>
                {t('donate.become-supporter')}
              </p>
              <p className='donation-animation-bullet-2'>
                {t('donate.remove-distractions')}
              </p>
              <p className='donation-animation-bullet-3'>
                {t('donate.reach-goals-faster')}
              </p>
              <p className='donation-animation-bullet-4'>
                {t('donate.help-millions-learn')}
              </p>
            </>
          )}
        </div>
        <img
          key={animationKey}
          alt=''
          src={animationSrc}
          id={'donation-animation'}
          data-playwright-test-label='donation-animation'
        />
      </div>
    </>
  );
};

const BecomeASupporterConfirmation = ({
  recentlyClaimedBlock,
  recentlyClaimedModule,
  showHeaderAndFooter,
  closeDonationModal,
  donationAttempted,
  showForm,
  setShowHeaderAndFooter,
  handleProcessing,
  setShowForm
}: {
  recentlyClaimedBlock: RecentlyClaimedBlock;
  recentlyClaimedModule: RecentlyClaimedModule;
  showHeaderAndFooter: boolean;
  closeDonationModal: () => void;
  donationAttempted: boolean;
  showForm: boolean;
  setShowHeaderAndFooter: (arg: boolean) => void;
  handleProcessing: () => void;
  setShowForm: (arg: boolean) => void;
}) => {
  return (
    <div className='no-delay-fade-in'>
      <div className='donation-icon-container'>
        <Illustration />
      </div>
      <ModalHeader
        recentlyClaimedBlock={recentlyClaimedBlock}
        recentlyClaimedModule={recentlyClaimedModule}
        showHeaderAndFooter={showHeaderAndFooter}
        donationAttempted={donationAttempted}
        showForm={showForm}
      />
      <Spacer size='xs' />
      {showForm ? (
        <MultiTierDonationForm
          setShowHeaderAndFooter={setShowHeaderAndFooter}
          handleProcessing={handleProcessing}
          paymentContext={PaymentContext.Modal}
          isMinimalForm={true}
        />
      ) : (
        <Benefits setShowForm={setShowForm} />
      )}
      {(showHeaderAndFooter || donationAttempted) && (
        <CloseButtonRow
          closeDonationModal={closeDonationModal}
          donationAttempted={donationAttempted}
        />
      )}
    </div>
  );
};

function DonationModalBody({
  closeDonationModal,
  recentlyClaimedBlock,
  recentlyClaimedModule,
  setCanClose
}: DonationModalBodyProps): JSX.Element {
  const [donationAttempted, setDonationAttempted] = useState(false);
  const [showHeaderAndFooter, setShowHeaderAndFooter] = useState(true);
  const [isAnimationVisible, setIsAnimationVisible] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(20);

  const handleProcessing = () => {
    setDonationAttempted(true);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSecondsRemaining(prevSeconds => prevSeconds - 1);
    }, 1000);

    if (secondsRemaining <= 0) {
      setIsAnimationVisible(false);
      setCanClose(true);
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [secondsRemaining, setCanClose]);

  return (
    <Modal.Body borderless alignment='start'>
      <div aria-live='polite' className='donation-modal'>
        {isAnimationVisible ? (
          <AnimationContainer secondsRemaining={secondsRemaining} />
        ) : (
          <BecomeASupporterConfirmation
            recentlyClaimedBlock={recentlyClaimedBlock}
            recentlyClaimedModule={recentlyClaimedModule}
            showHeaderAndFooter={showHeaderAndFooter}
            closeDonationModal={closeDonationModal}
            donationAttempted={donationAttempted}
            showForm={showForm}
            setShowHeaderAndFooter={setShowHeaderAndFooter}
            handleProcessing={handleProcessing}
            setShowForm={setShowForm}
          />
        )}
      </div>
    </Modal.Body>
  );
}

DonationModalBody.displayName = 'DonationModalBody';
Benefits.displayName = 'DonationModalBenefits';

export default DonationModalBody;
