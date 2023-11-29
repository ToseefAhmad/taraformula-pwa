import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './accountPrivacySettings.gql.js';

export const useAccountPrivacyForm = (props = {}) => {
  const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
  const {
    deleteCustomerAccountMutation,
    downloadCustomerDataMutation,
    anonimiseCustomerDataMutation
  } = operations;

  const [isShowPassword, setIsShowPassword] = useState(!props.hidePassword);
  const [displayError, setDisplayError] = useState(false);
  const [formSubmitMessage, setFormSubmitMessage] = useState('');
  const [customerData, setCustomerData] = useState([]);
  const [deleteAccount, { error: deleteActionError }] = useMutation(
    deleteCustomerAccountMutation,
    {
      fetchPolicy: 'no-cache'
    }
  );
  const [anonymiseData, { error: anonymiseDataError }] = useMutation(
    anonimiseCustomerDataMutation,
    {
      fetchPolicy: 'no-cache'
    }
  );
  const [loadCustomerData, { error: customerDataError }] = useMutation(
    downloadCustomerDataMutation,
    {
      fetchPolicy: 'no-cache'
    }
  );

  const togglePassword = useCallback(() => {
    setIsShowPassword(!isShowPassword);
  }, [setIsShowPassword, isShowPassword]);

  const formSubmit = useCallback(
    async form => {
      try {
        if (props.actionCode === 'delete') {
          const { data } = await deleteAccount({
            variables: {
              password: form.password
            }
          });

          const { requestAmGdprAccountDeletion: deletionData } = data || {};
          setFormSubmitMessage(deletionData.message);
        }

        if (props.actionCode === 'anonymize') {
          const { data } = await anonymiseData({
            variables: {
              password: form.password
            }
          });

          const { anonymiseAmGdprCustomer: anonymiseGdprData } = data || {};
          setFormSubmitMessage(anonymiseGdprData.message);
        }

        if (props.actionCode === 'download') {
          const { data } = await loadCustomerData({
            variables: {
              password: form.password
            }
          });

          const { amGetGdprCustomerPersonalData: customerPersonalData } =
            data || {};
          setCustomerData(customerPersonalData);
        }
      } catch (error) {
        setDisplayError(true);
      }
    },
    [
      props,
      deleteAccount,
      setFormSubmitMessage,
      anonymiseData,
      loadCustomerData,
      setCustomerData
    ]
  );

  const errors = displayError
    ? [deleteActionError, anonymiseDataError, customerDataError]
    : [];

  return {
    customerData,
    formSubmitMessage,
    errors,
    togglePassword,
    isShowPassword,
    handleSubmit: formSubmit
  };
};
