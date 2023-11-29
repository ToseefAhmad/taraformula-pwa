import { useLazyQuery, useMutation } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import { useFieldApi } from 'informed';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './gdprConcents.gql.js';
import { useAmGdprContext } from '../context';
import { getCheckedConsentArray, parseLink } from '../../utils/index';

export const useCheckboxWithModal = (props = {}) => {
  const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
  const { giveGdprConsentMutation, getGdprPolicyText } = operations;
  const {
    checkboxName,
    consentCode,
    consentFrom,
    hasAgreement,
    checkboxLabel
  } = props;
  const { checkedConsents, getGdprConsents } = useAmGdprContext();
  const [formSubmitMessage, setFormSubmitMessage] = useState('');
  const [displayError, setDisplayError] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const checkboxApi = useFieldApi(checkboxName);
  const [applyCheckbox, { error: applyCheckboxError }] = useMutation(
    giveGdprConsentMutation,
    {
      fetchPolicy: 'no-cache'
    }
  );
  const [loadQuery, { data: modalData }] = useLazyQuery(getGdprPolicyText, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first'
  });
  const label = parseLink(checkboxLabel);

  useEffect(() => {
    if (hasAgreement) {
      checkboxApi.setValue(true);
      setIsChecked(true);
    }
  }, [hasAgreement, checkboxApi]);

  const handleCancel = useCallback(() => {
    setIsShowModal(false);
  }, [setIsShowModal]);

  const handleClick = useCallback(async () => {
    if (consentFrom === 'registration') {
      getCheckedConsentArray(
        checkedConsents,
        consentFrom,
        consentCode,
        !isChecked
      );
    } else {
      try {
        const { data } = await applyCheckbox({
          variables: {
            consents: [
              {
                consent_from: consentFrom,
                consent_code: consentCode,
                has_agreement: !isChecked
              }
            ]
          },
          refetchQueries: [{ query: getGdprConsents }],
          awaitRefetchQueries: true
        });

        const { giveAmGdprConsent: applyCheckboxData } = data || {};
        setFormSubmitMessage(applyCheckboxData.message);
      } catch (error) {
        setDisplayError(true);
      }
    }
    setIsChecked(prev => !prev);
  }, [
    applyCheckbox,
    consentFrom,
    consentCode,
    setFormSubmitMessage,
    isChecked,
    setIsChecked,
    getGdprConsents,
    checkedConsents
  ]);

  const handleSubmit = useCallback(async () => {
    setIsShowModal(false);
    if (!isChecked) {
      checkboxApi.setValue(true);
      setIsChecked(true);
      await handleClick();
    }
  }, [setIsShowModal, checkboxApi, setIsChecked, handleClick, isChecked]);

  const getModalData = useCallback(
    id => {
      loadQuery({
        variables: { id }
      });

      setIsShowModal(true);
    },
    [loadQuery]
  );

  const { amGetGdprPolicyText: modalContent } = modalData || {};
  const errors = displayError ? [applyCheckboxError] : [];

  return {
    isShowModal,
    handleSubmit,
    handleCancel,
    modalContent,
    getModalData,
    handleClick,
    errors,
    formSubmitMessage,
    label
  };
};
