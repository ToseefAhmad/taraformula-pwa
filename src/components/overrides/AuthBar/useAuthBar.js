import { useMutation } from '@apollo/client';
import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { SIGN_OUT } from '@magento/peregrine/lib/talons/Header/accountMenu.gql';

export const useAuthBar = ({ disabled, showMyAccount }) => {
    const [
        ,
        {
            actions: { setShowAuthModal, toggleDrawer }
        }
    ] = useAppContext();

    const [{ isSignedIn: isUserSignedIn }, { signOut }] = useUserContext();
    const history = useHistory();
    const [revokeToken] = useMutation(SIGN_OUT);

    const handleSignIn = useCallback(() => {
        toggleDrawer(false);
        setShowAuthModal(true);
    }, [setShowAuthModal, toggleDrawer]);

    const handleShowMyAccount = useCallback(() => {
        showMyAccount();
    }, [showMyAccount]);

    const handleSignOut = useCallback(async () => {
        // Delete cart/user data from the redux store.
        await signOut({ revokeToken });

        // Refresh the page as a way to say "re-initialize". An alternative
        // Would be to call apolloClient.resetStore() but that would require
        // A large refactor.
        history.go(0);
    }, [history, revokeToken, signOut]);

    return {
        handleShowMyAccount,
        handleSignIn,
        isDisabled: disabled,
        isUserSignedIn,
        handleSignOut
    };
};
