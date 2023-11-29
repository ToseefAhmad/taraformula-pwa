import { useSocialAccountsPage } from '@amasty/social-login/src/talons/useSocialAccountsPage';
import { object, string } from 'prop-types';
import React, { Fragment } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { useSocialLogin } from '@app/components/SocialLogin/useSocialLogin';

import SocialLinkShimmer from './socialLink.shimmer';

const SocialLink = ({ type, classes }) => {
    const { linkedAccounts, loading, handleUnlink, isEnabled } = useSocialAccountsPage();
    const { handleLoginClick, socialButtons, isSigningIn, errors } = useSocialLogin();
    const { formatMessage } = useIntl();
    const unlinkText = formatMessage({
        id: 'socialLogin.unlinkConfirm',
        defaultMessage: 'Are you sure you want to unlink your account?'
    });

    if (!isEnabled || loading || isSigningIn || errors.length) {
        return <SocialLinkShimmer />;
    }

    const button = Array.isArray(socialButtons) && socialButtons.find(btn => btn.type === type);
    const account = Array.isArray(linkedAccounts) && linkedAccounts.find(acc => acc.type === type);

    const link =
        typeof button === 'object' && button !== null ? (
            typeof account === 'object' && account !== null ? (
                <button
                    className={classes.socialLink}
                    onClick={() => {
                        if (window.confirm(unlinkText)) handleUnlink(account.type);
                    }}
                >
                    <FormattedMessage id={'socialLogin.unlink'} defaultMessage={'Unlink'} />
                </button>
            ) : (
                <button className={classes.socialLink} onClick={() => handleLoginClick(button.type)}>
                    <FormattedMessage id={'socialLogin.link'} defaultMessage={'Link'} />
                </button>
            )
        ) : (
            <SocialLinkShimmer />
        );

    return <Fragment>{link}</Fragment>;
};

SocialLink.propTypes = {
    type: string,
    classes: object
};

export default SocialLink;
