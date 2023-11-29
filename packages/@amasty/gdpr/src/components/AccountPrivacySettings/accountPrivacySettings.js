import React, { useMemo } from 'react';
import { useAccountPrivacySettings } from '../../talons/useAccountPrivacySettings';
import PolicyButton from '../PolicyButton';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from '../AccountPrivacySettings/accountPrivacySettings.css';
import AccountPrivacyForm from './accountPrivacyForm';

const AccountPrivacySettings = props => {
  const classes = mergeClasses(defaultClasses, props.classes);
  const { loading, settings } = useAccountPrivacySettings();

  const settingsBlocks = useMemo(
    () =>
      !Array.isArray(settings) || !settings.length
        ? null
        : settings.map((item, index) => {
            if (!item.action && !item.content) {
              return <PolicyButton key={index} item={item} index={index} />;
            }

            return <AccountPrivacyForm key={index} index={index} item={item} />;
          }),
    [settings]
  );

  if (!settingsBlocks) {
    return null;
  }

  if (loading) {
    return fullPageLoadingIndicator;
  }

  return <div className={classes.root}>{settingsBlocks}</div>;
};

export default AccountPrivacySettings;
