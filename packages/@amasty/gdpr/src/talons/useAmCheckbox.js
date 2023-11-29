import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './gdprConcents.gql.js';
import { useMutation, useQuery } from '@apollo/client';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useAmCheckbox = (props = {}) => {
  const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
  const checkedConsents = useRef([]);
  const { getGdprConsents, giveGdprConsentMutation } = operations;
  const defaultFetchPolicy = 'cache-first';
  const [fetchPolicy, setFetchPolicy] = useState(defaultFetchPolicy);
  const [{ isSignedIn }] = useUserContext();

  const [applyCheckbox] = useMutation(giveGdprConsentMutation, {
    fetchPolicy: 'no-cache'
  });

  const acceptRegistrationConsents = useCallback(async () => {
    try {
      await applyCheckbox({
        variables: {
          consents: checkedConsents.current
        },
        refetchQueries: [{ query: getGdprConsents }],
        awaitRefetchQueries: true
      });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(error);
      }
    }
  }, [checkedConsents, applyCheckbox, getGdprConsents]);

  useEffect(() => {
    setFetchPolicy('network-only');

    if (isSignedIn && checkedConsents.current.length) {
      acceptRegistrationConsents();
    }
  }, [isSignedIn, acceptRegistrationConsents]);

  const { loading, error, data } = useQuery(getGdprConsents, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: fetchPolicy
  });
  const { amGetGdprConsents: settings } = data || {};

  useEffect(() => {
    if (fetchPolicy !== defaultFetchPolicy) {
      setFetchPolicy(defaultFetchPolicy);
    }
  }, [fetchPolicy, setFetchPolicy, defaultFetchPolicy]);

  return {
    settingsLoading: loading,
    error,
    settings,
    getGdprConsents,
    checkedConsents
  };
};
