import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from '../AccountPrivacySettings/accountPrivacySettings.css';
import { Form } from 'informed';
import AccountCheckbox from './accountCheckbox';
import PasswordField from './passwordField';
import ActionButton from './actionButton';
import AmCheckbox from '../AmCheckbox';
import SuccessMessage from '../SuccessMessage';
import { useAccountPrivacyForm } from '../../talons/useAccountPrivacyForm';
import FormError from '@magento/venia-ui/lib/components/FormError';
import DownloadCsv from '../DownloadCsv/downloadCsv';
import { number, object } from 'prop-types';
import RichContent from '@magento/venia-ui/lib/components/RichContent';

const AccountPrivacyForm = props => {
  const classes = mergeClasses(defaultClasses, props.classes);
  const { item, index } = props;
  const {
    togglePassword,
    isShowPassword,
    handleSubmit,
    errors,
    formSubmitMessage,
    customerData
  } = useAccountPrivacyForm({
    hidePassword: item.hidePassword,
    actionCode: item.actionCode,
    inputName: 'password' + item.actionCode
  });
  const isGivenConsent = item.actionCode === 'given_consents';
  const getConsents = () => {
    return (
      isGivenConsent && (
        <AmCheckbox
          location={'privacy_settings'}
          isAccountSettingsPage={true}
        />
      )
    );
  };

  return (
    <Form key={index} className={classes.item} onSubmit={handleSubmit}>
      <h3 className={classes.title}>{item.title}</h3>
      <RichContent classes={{ root: classes.content }} html={item.content} />
      <AccountCheckbox
        item={item}
        index={index}
        togglePassword={togglePassword}
      />
      <PasswordField
        item={item}
        index={index}
        name={`password${item.actionCode}`}
        isShowPassword={isShowPassword}
      />
      <DownloadCsv data={customerData} />
      {getConsents()}
      <FormError errors={errors} scrollOnError={false} />
      <SuccessMessage message={formSubmitMessage} />
      {!isGivenConsent && !customerData.length && (
        <ActionButton item={item} index={index} />
      )}
    </Form>
  );
};

AccountPrivacyForm.propTypes = {
  item: object,
  index: number
};

export default AccountPrivacyForm;
