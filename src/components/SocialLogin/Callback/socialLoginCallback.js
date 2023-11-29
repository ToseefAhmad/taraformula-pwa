import React from 'react';
import { FormattedMessage } from 'react-intl';

import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import classes from './socialLoginCallback.module.css';
import { useSocialLoginCallback } from './useSocialLoginCallback';

// Page to handle social login return
const SocialLoginCallback = () => {
    useSocialLoginCallback();

    return (
        <LoadingIndicator classes={classes} global>
            <FormattedMessage id="socialLogin.redirecting" defaultMessage="Redirecting back to website" />
        </LoadingIndicator>
    );
};

export default SocialLoginCallback;
