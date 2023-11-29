import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from '../AccountPrivacySettings/accountPrivacySettings.css';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox/checkbox';
import { mustBeChecked } from '@magento/venia-ui/lib/util/formValidators';
import { useIntl } from 'react-intl';
import { func, number, object } from 'prop-types';

const AccountCheckbox = props => {
  const classes = mergeClasses(defaultClasses, props.classes);
  const { formatMessage } = useIntl();
  const { item, index, togglePassword } = props;

  if (!item.hasCheckbox) {
    return null;
  }

  return (
    <div className={classes.checkboxContainer}>
      <Checkbox
        onClick={togglePassword}
        field={`privacy.checkbox${index}`}
        label={formatMessage({
          id: `privacy.checkbox${index}`,
          defaultMessage: item.checkboxText
        })}
        validate={mustBeChecked}
        validateOnBlur
      />
    </div>
  );
};

AccountCheckbox.propTypes = {
  item: object,
  index: number,
  togglePassword: func
};

export default AccountCheckbox;
