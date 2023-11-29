import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from '../AccountPrivacySettings/accountPrivacySettings.css';
import { FormattedMessage } from 'react-intl';
import Button from '@magento/venia-ui/lib/components/ButtonGroup/button';
import { number, object } from 'prop-types';

const ActionButton = props => {
  const classes = mergeClasses(defaultClasses, props.classes);
  const { item, index } = props;

  if (!item.action) {
    return null;
  }

  return (
    <Button
      classes={{ root_lowPriority: classes.filterButton }}
      disabled={false}
      type="submit"
    >
      <FormattedMessage
        id={`privacy.submitButton${index}`}
        defaultMessage={item.submitText}
      />
    </Button>
  );
};

ActionButton.propTypes = {
  item: object,
  index: number
};

export default ActionButton;
