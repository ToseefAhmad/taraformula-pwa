import React, { Fragment, Suspense } from 'react';
import { useCheckboxWithModal } from '../../talons/useCheckboxWithModal';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox/checkbox';
import PrivacyModal from '../PrivacyModal/privacyModal';
import { mustBeChecked } from '@magento/venia-ui/lib/util/formValidators';
import Label from './label';
import { bool, number, object, string } from 'prop-types';
import FormError from '@magento/venia-ui/lib/components/FormError';
import SuccessMessage from '../SuccessMessage';

const CheckboxWithModal = props => {
  const { item, index, isAccountSettingsPage, location } = props;
  const {
    isShowModal,
    handleSubmit,
    modalContent,
    getModalData,
    handleCancel,
    handleClick,
    errors,
    formSubmitMessage,
    label
  } = useCheckboxWithModal({
    checkboxName: 'amgdpr_agreement[' + item.consent_code + ']',
    consentCode: item.consent_code,
    consentFrom: location,
    hasAgreement: item.has_agreement,
    checkboxLabel: item.consent_text
  });

  const getLabel = checkbox => {
    const id = checkbox.consent_id;

    return <Label message={label} id={id} handleClick={getModalData} />;
  };

  const additionalProps =
    item.is_required && !isAccountSettingsPage
      ? { validate: mustBeChecked }
      : {};

  return (
    <Fragment key={index}>
      <Checkbox
        onClick={handleClick}
        id={location + item.consent_id}
        field={`amgdpr_agreement[${item.consent_code}]`}
        label={getLabel(item)}
        {...additionalProps}
      />
      <FormError errors={errors} scrollOnError={false} />
      {location !== 'registration' && (
        <SuccessMessage message={formSubmitMessage} />
      )}
      <Suspense fallbac45k={null}>
        <PrivacyModal
          isOpen={isShowModal}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          content={modalContent}
          location={location}
        />
      </Suspense>
    </Fragment>
  );
};

CheckboxWithModal.propTypes = {
  item: object,
  index: number,
  isAccountSettingsPage: bool,
  location: string
};

export default CheckboxWithModal;
