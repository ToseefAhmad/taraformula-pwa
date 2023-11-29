import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useHistory } from 'react-router-dom';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './accountPrivacySettings.gql.js';

export const useAccountPrivacySettings = (props = {}) => {
  const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
  const { getAccountSettings } = operations;
  const [{ isSignedIn }] = useUserContext();
  const history = useHistory();

  const { loading, error, data } = useQuery(getAccountSettings, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    skip: !isSignedIn
  });

  // If the user is no longer signed in, redirect to the home page.
  useEffect(() => {
    if (!isSignedIn) {
      history.push('/');
    }
  }, [history, isSignedIn]);

  const { amGetGdprAccountAction: settings } = data || {};

  return {
    settingsLoading: loading,
    error,
    settings
  };
};
