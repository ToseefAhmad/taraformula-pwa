import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { useHeader } from '@app/components/overrides/Header/useHeader';
import MegaMenuShimmer from '@app/components/overrides/MegaMenu/megaMenu.shimmer';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useAccountTrigger } from '@magento/peregrine/lib/talons/Header/useAccountTrigger';

import classes from './accountTrigger.module.css';

/**
 * The AccountTrigger component is the call to action in the site header
 * that toggles the AccountMenu dropdown.
 */
const AccountTrigger = () => {
    const { showAuthModal, handleTriggerClick } = useAccountTrigger();
    const { translationReady } = useHeader();
    const [{ isSignedIn: isUserSignedIn }] = useUserContext();
    const { formatMessage } = useIntl();
    const history = useHistory();

    const rootClassName = showAuthModal && !isUserSignedIn ? classes.root_open : classes.root;

    const redirectToAccountPage = () => {
        const path = '/account';
        history.push(path);
    };

    const accountLinkText = formatMessage({
        id: isUserSignedIn ? 'authBar.account' : 'authBar.login',
        defaultMessage: isUserSignedIn ? 'My Account' : 'Login'
    });

    const accountButton = (
        <button
            aria-label={formatMessage({
                id: 'accountTrigger.ariaLabel',
                defaultMessage: 'Toggle My Account Menu'
            })}
            className={classes.trigger}
            onClick={isUserSignedIn ? redirectToAccountPage : handleTriggerClick}
        >
            <span className={classes.accountLink} title={accountLinkText}>
                {accountLinkText}
            </span>
        </button>
    );

    return (
        <Fragment>
            <div className={rootClassName}>{translationReady ? accountButton : <MegaMenuShimmer />}</div>
        </Fragment>
    );
};

AccountTrigger.displayName = 'AccountTrigger';

export default AccountTrigger;
