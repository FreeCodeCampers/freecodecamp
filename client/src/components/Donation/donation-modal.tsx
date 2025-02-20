import { WindowLocation } from '@gatsbyjs/reach-router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { goToAnchor } from 'react-scrollable-anchor';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import { createSelector } from 'reselect';
import { Modal } from '@freecodecamp/ui';
import { useFeature } from '@growthbook/growthbook-react';

import { closeDonationModal } from '../../redux/actions';
import {
  isDonationModalOpenSelector,
  recentlyClaimedBlockSelector,
  recentlyClaimedModuleSelector
} from '../../redux/selectors';
import { SuperBlocks } from '../../../../shared/config/curriculum';
import { isLocationSuperBlock } from '../../utils/path-parsers';
import { playTone } from '../../utils/tone';
import callGA from '../../analytics/call-ga';
import DonationModalBody from './donation-modal-body';

type RecentlyClaimedBlock = null | { block: string; superBlock: SuperBlocks };
type RecentlyClaimedModule = null | { module: string; superBlock: SuperBlocks };

const mapStateToProps = createSelector(
  isDonationModalOpenSelector,
  recentlyClaimedBlockSelector,
  recentlyClaimedModuleSelector,
  (
    show: boolean,
    recentlyClaimedBlock: RecentlyClaimedBlock,
    recentlyClaimedModule: RecentlyClaimedModule
  ) => ({
    show,
    recentlyClaimedBlock,
    recentlyClaimedModule
  })
);

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators({ closeDonationModal }, dispatch);

type DonateModalProps = {
  activeDonors?: number;
  closeDonationModal: typeof closeDonationModal;
  location?: WindowLocation;
  recentlyClaimedBlock: RecentlyClaimedBlock;
  recentlyClaimedModule: RecentlyClaimedModule;
  show: boolean;
};

function DonateModal({
  show,
  closeDonationModal,
  location,
  recentlyClaimedBlock,
  recentlyClaimedModule
}: DonateModalProps): JSX.Element {
  const [canClose, setCanClose] = useState(false);
  const isA11yFeatureEnabled = useFeature('a11y-donation-modal').on;

  useEffect(() => {
    if (show) {
      void playTone('donation');
      callGA({ event: 'pageview', pagePath: '/donation-modal' });
      callGA({
        event: 'donation_view',
        action: `Displayed ${
          recentlyClaimedBlock !== null ? 'Block' : 'Progress'
        } Donation Modal`
      });
    }
  }, [show, recentlyClaimedBlock]);

  const handleModalHide = () => {
    // If modal is open on a SuperBlock page
    if (isLocationSuperBlock(location)) {
      goToAnchor('claim-cert-block');
    }

    if (isA11yFeatureEnabled && canClose) {
      closeDonationModal();
    }
  };

  return (
    <Modal size='large' onClose={handleModalHide} open={show}>
      <DonationModalBody
        closeDonationModal={closeDonationModal}
        recentlyClaimedBlock={recentlyClaimedBlock}
        recentlyClaimedModule={recentlyClaimedModule}
        setCanClose={setCanClose}
      />
    </Modal>
  );
}

DonateModal.displayName = 'DonateModal';

export default connect(mapStateToProps, mapDispatchToProps)(DonateModal);
