import { useCallback, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './gdprConcents.gql.js';

export const usePolicyButton = (props = {}) => {
  const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
  const { acceptGdprPolicyMutation, getGdprPolicyText } = operations;
  const [isShowMode, setIsShowMode] = useState(false);

  const [loadQuery, { data: modalData }] = useLazyQuery(getGdprPolicyText, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first'
  });
  const { amGetGdprPolicyText: modalContent } = modalData || {};
  const [acceptPolicy] = useMutation(acceptGdprPolicyMutation, {
    fetchPolicy: 'no-cache'
  });

  const handleCancel = useCallback(() => {
    setIsShowMode(false);
  }, [setIsShowMode]);

  const showUpdateMode = useCallback(() => {
    loadQuery({
      variables: { id: 0 }
    });
    setIsShowMode(true);
  }, [setIsShowMode, loadQuery]);

  const handleSubmit = useCallback(async () => {
    try {
      await acceptPolicy({
        variables: {
          policy_version: modalContent.version
        }
      });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(error);
      }
    }
    setIsShowMode(false);
  }, [setIsShowMode, acceptPolicy, modalContent]);

  return {
    modalContent,
    isShowMode,
    showUpdateMode,
    handleCancel,
    handleSubmit
  };
};
