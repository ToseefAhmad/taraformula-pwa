import { useCallback, useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './gdprConcents.gql.js';

export const usePrivacyPolicy = (props = {}) => {
  const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
  const { acceptGdprPolicyMutation, getGdprPolicyText } = operations;
  const [isShowMode, setIsShowMode] = useState(false);
  const history = useHistory();
  const isModalClosed = useRef(false);

  const [acceptPolicy] = useMutation(acceptGdprPolicyMutation, {
    fetchPolicy: 'no-cache'
  });

  const { loading, data } = useQuery(getGdprPolicyText, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: { id: 0 }
  });

  const { amGetGdprPolicyText: policyData } = data || {};
  const { need_show: needShow, version_changed: isVersionChanged } =
    policyData || {};

  useEffect(() => {
    isModalClosed.current = false;
  }, [history.location, isModalClosed]);

  useEffect(() => {
    if (needShow && !isShowMode) {
      setIsShowMode(true);
    }
  }, [isShowMode, setIsShowMode, needShow]);

  const handleCancel = useCallback(() => {
    setIsShowMode(false);
    isModalClosed.current = true;
  }, [setIsShowMode]);
  const handleSubmit = useCallback(async () => {
    setIsShowMode(false);
    isModalClosed.current = true;

    try {
      await acceptPolicy({
        variables: {
          policy_version: policyData.version
        },
        refetchQueries: [{ query: getGdprPolicyText, variables: { id: 0 } }],
        awaitRefetchQueries: true
      });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(error);
      }
    }
  }, [setIsShowMode, acceptPolicy, policyData, getGdprPolicyText]);

  return {
    isModalClosed: isModalClosed.current,
    loading,
    isShowMode,
    handleCancel,
    handleSubmit,
    policyData,
    isVersionChanged
  };
};
