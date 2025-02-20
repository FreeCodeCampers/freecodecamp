import { isEmpty } from 'lodash-es';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { isBrowser } from '../../utils/index';
import FourOhFour from '../components/FourOhFour';
import Loader from '../components/helpers/loader';
import Profile from '../components/profile/profile';
import { fetchProfileForUser } from '../redux/actions';
import {
  usernameSelector,
  userByNameSelector,
  userProfileFetchStateSelector
} from '../redux/selectors';
import { User } from '../redux/prop-types';
import { Socials } from '../components/profile/components/internet';

interface ShowProfileOrFourOhFourProps {
  fetchProfileForUser: (username: string) => void;
  updateMyPortfolio: () => void;
  submitNewAbout: () => void;
  updateMySocials: (formValues: Socials) => void;
  fetchState: {
    pending: boolean;
    complete: boolean;
    errored: boolean;
  };
  isSessionUser: boolean;
  maybeUser?: string;
  requestedUser: User;
  showLoading: boolean;
}

const createRequestedUserSelector =
  () =>
  (state: unknown, { maybeUser = '' }) =>
    userByNameSelector(maybeUser.toLowerCase())(state) as User;
const createIsSessionUserSelector =
  () =>
  (state: unknown, { maybeUser = '' }) =>
    maybeUser.toLowerCase() === usernameSelector(state);

const makeMapStateToProps =
  () => (state: unknown, props: ShowProfileOrFourOhFourProps) => {
    const requestedUserSelector = createRequestedUserSelector();
    const isSessionUserSelector = createIsSessionUserSelector();
    const fetchState = userProfileFetchStateSelector(
      state
    ) as ShowProfileOrFourOhFourProps['fetchState'];
    return {
      requestedUser: requestedUserSelector(state, props),
      isSessionUser: isSessionUserSelector(state, props),
      showLoading: fetchState.pending,
      fetchState
    };
  };

const mapDispatchToProps: {
  fetchProfileForUser: ShowProfileOrFourOhFourProps['fetchProfileForUser'];
} = {
  fetchProfileForUser
};

function ShowProfileOrFourOhFour({
  requestedUser,
  maybeUser,
  fetchProfileForUser,
  isSessionUser,
  showLoading
}: ShowProfileOrFourOhFourProps) {
  useEffect(() => {
    // If the user is not already in the store, fetch it
    if (isEmpty(requestedUser)) {
      if (maybeUser) {
        fetchProfileForUser(maybeUser);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isBrowser()) {
    return null;
  }

  return isEmpty(requestedUser) ? (
    showLoading ? (
      <Loader fullScreen={true} />
    ) : (
      <FourOhFour />
    )
  ) : (
    <Profile isSessionUser={isSessionUser} user={requestedUser} />
  );
}

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(ShowProfileOrFourOhFour);
