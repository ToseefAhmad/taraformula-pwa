import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from '../AccountPrivacySettings/accountPrivacySettings.css';
import Password from '@magento/venia-ui/lib/components/Password';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import { useIntl } from 'react-intl';
import { bool, number, object } from 'prop-types';

const PasswordField = props => {
  const classes = mergeClasses(defaultClasses, props.classes);
  const { formatMessage } = useIntl();
  const { item, index, isShowPassword } = props;

  if (!item.needPassword || !item.action || !isShowPassword) {
    return null;
  }

  return (
    <Password
      classes={{ root: classes.password }}
      fieldName="password"
      label={formatMessage({
        id: 'privacy.password' + index,
        defaultMessage: 'Current Password'
      })}
      validate={isRequired}
      isToggleButtonHidden={false}
    />
  );
};

PasswordField.propTypes = {
  item: object,
  index: number,
  isShowPassword: bool
};

export default PasswordField;
