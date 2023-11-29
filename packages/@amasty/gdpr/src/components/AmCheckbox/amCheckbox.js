import React, { useMemo, useRef } from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './amCheckbox.css';
import { useAmGdprContext } from '../../context';
import CheckboxWithModal from './checkboxWithModal';
import { bool, string } from 'prop-types';
import { getVisibleConsents } from '../../../utils/index';

const AmCheckbox = props => {
  const classes = mergeClasses(defaultClasses, props.classes);
  const { isAccountSettingsPage, location } = props;
  const { settings } = useAmGdprContext();
  const consents = useRef(settings);

  const propsArrayFiltered = useMemo(
    () => getVisibleConsents(consents.current, isAccountSettingsPage, location),
    [consents, isAccountSettingsPage, location]
  );

  const checkboxes = propsArrayFiltered.map((checkbox, index) => {
    return (
      <CheckboxWithModal
        key={index}
        item={checkbox}
        index={index}
        isAccountSettingsPage={isAccountSettingsPage}
        location={location}
      />
    );
  });

  if (!checkboxes.length) {
    return null;
  }

  return (
    <div
      className={[
        classes.checkbox,
        location === 'checkout' ? classes.checkout : ''
      ].join(' ')}
    >
      {checkboxes}
    </div>
  );
};

AmCheckbox.propTypes = {
  isAccountSettingsPage: bool,
  location: string
};

export default AmCheckbox;
