import React, { Fragment } from 'react';

import { Close as IconClose } from '@app/components/Icons';
import { useScrollLock } from '@magento/peregrine';
import CreateAccount from '@magento/venia-ui/lib/components/CreateAccount';
import ForgotPassword from '@magento/venia-ui/lib/components/ForgotPassword';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Mask from '@magento/venia-ui/lib/components/Mask';
import SignIn from '@magento/venia-ui/lib/components/SignIn';

import classes from './authModal.module.css';
import { useAuthModal } from './useAuthModal';

const AuthModal = () => {
    const {
        authModalRef,
        showAuthModal,
        showCreateAccount,
        showForgotPassword,
        handleClose,
        handleCancel,
        handleCreateAccount,
        setUsername,
        username,
        view
    } = useAuthModal();

    // Keep scroll lock
    useScrollLock(showAuthModal);

    const closeButton = <Icon classes={{ root: classes.iconRoot }} src={IconClose} onClick={handleClose} />;

    let child = null;

    switch (view) {
        case 'CREATE_ACCOUNT': {
            child = (
                <CreateAccount
                    initialValues={{ email: username }}
                    onSubmit={handleCreateAccount}
                    onCancel={handleCancel}
                />
            );
            break;
        }
        case 'FORGOT_PASSWORD': {
            child = <ForgotPassword initialValues={{ email: username }} onCancel={handleCancel} />;
            break;
        }
        case 'SIGN_IN': {
            child = (
                <SignIn
                    setDefaultUsername={setUsername}
                    showCreateAccount={showCreateAccount}
                    showForgotPassword={showForgotPassword}
                />
            );
            break;
        }
    }

    return showAuthModal ? (
        <Fragment>
            <div className={classes.root} ref={authModalRef}>
                {closeButton}
                {child}
            </div>
            <Mask isActive={showAuthModal} dismiss={handleClose} classes={{ root_active: classes.maskRootActive }} />
        </Fragment>
    ) : null;
};

export default AuthModal;
