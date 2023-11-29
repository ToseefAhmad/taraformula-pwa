import { bool, func } from 'prop-types';
import React from 'react';

import { Close as IconClose } from '@app/components/Icons';
import { useGuestSignIn } from '@magento/peregrine/lib/talons/CheckoutPage/GuestSignIn/useGuestSignIn';
import CreateAccount from '@magento/venia-ui/lib/components/CreateAccount';
import ForgotPassword from '@magento/venia-ui/lib/components/ForgotPassword';
import Icon from '@magento/venia-ui/lib/components/Icon';
import SignIn from '@magento/venia-ui/lib/components/SignIn';

import classes from './guestSignIn.module.css';

const GuestSignIn = ({ isActive, toggleActiveContent }) => {
    const { handleBackToCheckout, toggleCreateAccountView, toggleForgotPasswordView, view } = useGuestSignIn({
        toggleActiveContent
    });

    const rootClass = isActive ? classes.root : classes.root_hidden;

    let content;
    if (view === 'SIGNIN') {
        content = <SignIn showCreateAccount={toggleCreateAccountView} showForgotPassword={toggleForgotPasswordView} />;
    } else if (view === 'FORGOT_PASSWORD') {
        content = <ForgotPassword onCancel={toggleForgotPasswordView} />;
    } else if (view === 'CREATE_ACCOUNT') {
        content = <CreateAccount isCancelButtonHidden={false} onCancel={toggleCreateAccountView} />;
    }

    const closeButton = <Icon classes={{ root: classes.iconRoot }} src={IconClose} onClick={handleBackToCheckout} />;

    return (
        <div className={rootClass}>
            <div className={classes.contentContainer}>
                {closeButton}
                {content}
            </div>
        </div>
    );
};

export default GuestSignIn;

GuestSignIn.propTypes = {
    isActive: bool.isRequired,
    toggleActiveContent: func.isRequired
};
