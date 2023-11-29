import { useSocialLoginContext } from '@amasty/social-login/src/context';
import { shape, string } from 'prop-types';
import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';

import SocialButtons from '../SocialButtons';

import { useUserContext } from '@magento/peregrine/lib/context/user';

import classes from './socialAuthentication.module.css';

const SocialAuthentication = ({ mode, page }) => {
    const { buttons, isEnabled, enabledModes } = useSocialLoginContext();

    const [{ isSignedIn }] = useUserContext();

    if (!isEnabled || !enabledModes.includes(mode) || isSignedIn) {
        return null;
    }

    const divider = page === 'signIn' && (
        <div className={classes.divider}>
            <span className={classes.dividerContent}>
                <FormattedMessage id={'signIn.dividerText'} defaultMessage={'OR'} />
            </span>
        </div>
    );

    const title = page === 'createAccount' && (
        <div className={classes.title}>
            <FormattedMessage id={'createAccount.dividerText'} defaultMessage={'Or register using'} />
        </div>
    );

    return (
        <Fragment>
            {title}
            <SocialButtons buttons={buttons} mode={mode} />
            {divider}
        </Fragment>
    );
};

SocialAuthentication.propTypes = {
    classes: shape({
        root: string
    }),
    mode: string,
    page: string
};

export default SocialAuthentication;
