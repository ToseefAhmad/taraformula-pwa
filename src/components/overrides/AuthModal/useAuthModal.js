import { useCallback, useEffect, useState, useRef } from 'react';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useEventListener } from '@magento/peregrine/lib/hooks/useEventListener';

export const useAuthModal = () => {
    const [
        { showAuthModal },
        {
            actions: { setShowAuthModal }
        }
    ] = useAppContext();

    const [view, setView] = useState(null);
    const [username, setUsername] = useState('');

    const [{ isSignedIn }] = useUserContext();

    useEffect(() => {
        if (!isSignedIn && showAuthModal) {
            setView('SIGN_IN');
        }
    }, [isSignedIn, showAuthModal]);

    const showSignIn = useCallback(() => {
        setView('SIGN_IN');
    }, []);

    const showCreateAccount = useCallback(() => {
        setView('CREATE_ACCOUNT');
    }, []);

    const showForgotPassword = useCallback(() => {
        setView('FORGOT_PASSWORD');
    }, []);

    const handleClose = useCallback(() => {
        setShowAuthModal(false);
    }, [setShowAuthModal]);

    const handleCancel = useCallback(() => {
        setView('SIGN_IN');
    }, []);

    const authModalRef = useRef(null);

    const maybeCollapse = useCallback(
        ({ target }) => {
            const isOutsideAuthModal = !authModalRef.current || !authModalRef.current.contains(target);

            if (isOutsideAuthModal && showAuthModal) {
                setShowAuthModal(false);
            }
        },
        [setShowAuthModal, showAuthModal]
    );

    useEventListener(globalThis.document, 'mousedown', maybeCollapse);

    return {
        authModalRef,
        showAuthModal,
        showSignIn,
        showCreateAccount,
        showForgotPassword,
        handleClose,
        handleCancel,
        setUsername,
        username,
        view
    };
};
