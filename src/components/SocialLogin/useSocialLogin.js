import { useMutation, useLazyQuery } from '@apollo/client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { useSignIn } from '@magento/peregrine/lib/talons/SignIn/useSignIn';
import BrowserPersistence from '@magento/peregrine/lib/util/simplePersistence';

import { GET_SOCIAL_LOGIN_BUTTON_CONFIG, GET_SOCIAL_LOGIN_URL, GET_SOC_ACCOUNT_DATA } from './socialLogin.gql';

const storage = new BrowserPersistence();
export const LocalStorageKey = 'socialLogin';

const getWindowParams = () => {
    const bottomPadding = 22;

    const screenX = globalThis.screenX || globalThis.screenLeft;
    const screenY = globalThis.screenY || globalThis.screenTop;
    const outerWidth = globalThis.outerWidth || (globalThis.document && document.body.clientWidth) || 0;
    const outerHeight =
        globalThis.outerHeight || (globalThis.document && document.body.clientHeight - bottomPadding) || 0;

    const width = 700;
    const height = 600;

    const leftDivider = 2;
    const topDivider = 2.5;

    const left = Math.round(screenX + (outerWidth - width) / leftDivider);
    const top = Math.round(screenY + (outerHeight - height) / topDivider);

    return `width=${width},height=${height},left=${left},top=${top}`;
};

export const useSocialLogin = (props = {}) => {
    const { open } = globalThis;
    const { handleSubmit } = useSignIn(props);
    const { formatMessage } = useIntl();
    const [
        { showAuthModal },
        {
            actions: { setShowAuthModal }
        }
    ] = useAppContext();
    const [{ isSignedIn }] = useUserContext();

    // Login popup
    const loginWindow = useRef(null);

    const [socialButtons, setSocialButtons] = useState([]);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errors, setErrors] = useState([]);

    const [fetchAuthUrl] = useMutation(GET_SOCIAL_LOGIN_URL);
    const fetchBtnConfig = useAwaitQuery(GET_SOCIAL_LOGIN_BUTTON_CONFIG);
    const [runQuery] = useLazyQuery(GET_SOC_ACCOUNT_DATA, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !isSignedIn
    });

    const handleLogin = useCallback(
        async type => {
            try {
                const url = await fetchAuthUrl({
                    variables: {
                        type
                    }
                });
                if (url.data && loginWindow.current) {
                    setIsSigningIn(true);
                    setErrors([]);
                    // Set loginUrl on the user initiated popup
                    loginWindow.current.location.href = url.data.getSocialLoginUrl;
                    /**
                     * Workaround for detecting cross-origin window close
                     * window.unbeforeunload works only for same origin windows
                     */
                    const timer = setInterval(async () => {
                        if (loginWindow.current.closed) {
                            clearInterval(timer);
                            const json = storage.getItem(LocalStorageKey);
                            if (json && !isSignedIn) {
                                const data = JSON.parse(json);
                                if (data.token) {
                                    handleSubmit({ token: data.token, type });
                                } else if (data.error) {
                                    setErrors([data.error]);
                                    setIsSigningIn(false);
                                }
                            } else {
                                try {
                                    runQuery();
                                } catch (e) {
                                    setIsSigningIn(false);
                                }

                                setIsSigningIn(false);
                            }
                            storage.removeItem(LocalStorageKey);
                            showAuthModal && setShowAuthModal(false);
                        }
                    }, 500);
                } else {
                    setErrors([
                        ...errors,
                        formatMessage({
                            id: 'socialLogin.wentWrong',
                            defaultMessage: 'Something went wrong. Please try again later'
                        })
                    ]);
                    loginWindow.current && loginWindow.current.close();
                    showAuthModal && setShowAuthModal(false);
                }
            } catch (e) {
                setErrors([...errors, e.message]);
                setIsSigningIn(false);
                loginWindow.current && loginWindow.current.close();
                showAuthModal && setShowAuthModal(false);
            }
        },
        [errors, fetchAuthUrl, formatMessage, handleSubmit, isSignedIn, runQuery, showAuthModal, setShowAuthModal]
    );

    const handleLoginClick = useCallback(
        type => {
            // Opens popup on user click, not in async call, so ios mobile devices allow to open popup.
            // IOs only allows to use open() on user interaction
            loginWindow.current = open('', type, getWindowParams());
            handleLogin(type);
        },
        [handleLogin, open]
    );

    const handleButtonFetch = useCallback(async () => {
        const buttons = await fetchBtnConfig();
        if (buttons.data) {
            setSocialButtons(buttons.data.amSocialLoginButtonConfig);
        }
    }, [fetchBtnConfig]);

    useEffect(() => {
        handleButtonFetch();
    }, [handleButtonFetch]);

    return {
        errors,
        isSigningIn,
        socialButtons,
        handleLoginClick,
        handleButtonFetch
    };
};
