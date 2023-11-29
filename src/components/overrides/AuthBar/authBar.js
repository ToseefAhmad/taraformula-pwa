import { shape, string, bool, func } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useAuthBar } from '@magento/peregrine/lib/talons/AuthBar/useAuthBar';

import classes from './authBar.module.css';

const AuthBar = ({ disabled, showMyAccount, showSignIn }) => {
    const { handleSignIn, isDisabled, isUserSignedIn, handleSignOut } = useAuthBar({
        disabled,
        showMyAccount,
        showSignIn
    });

    const history = useHistory();
    const [, { closeDrawer }] = useAppContext();

    const redirectToAccountPage = () => {
        const path = 'account';
        closeDrawer();
        history.push(path);
    };

    const accountLinkText = isUserSignedIn ? (
        <FormattedMessage id={'authBar.account'} defaultMessage={'Account'} />
    ) : (
        <FormattedMessage id={'authBar.login'} defaultMessage={'Login'} />
    );

    const signOutButton = isUserSignedIn ? (
        <button className={classes.signOutButton} disabled={isDisabled} onClick={handleSignOut}>
            <span className={classes.signOut}>
                <FormattedMessage id={'authBar.signOut'} defaultMessage={'Sign Out'} />
            </span>
        </button>
    ) : null;

    return (
        <div className={classes.root}>
            <div className={classes.wrapper}>
                <button
                    className={classes.accountButton}
                    disabled={isDisabled}
                    onClick={isUserSignedIn ? redirectToAccountPage : handleSignIn}
                >
                    <span className={classes.contents}>{accountLinkText}</span>
                </button>
                {signOutButton}
            </div>
        </div>
    );
};

export default AuthBar;

AuthBar.propTypes = {
    disabled: bool,
    showMyAccount: func,
    showSignIn: func,
    classes: shape({
        root: string,
        button: string,
        contents: string,
        icon: string,
        signIn: string
    })
};
