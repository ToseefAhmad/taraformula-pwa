import { useMutation } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';

import { LocalStorageKey } from '../useSocialLogin';

import BrowserPersistence from '@magento/peregrine/lib/util/simplePersistence';

import { SOCIAL_LOGIN_ACTION } from './socialLoginCallback.gql';

const storage = new BrowserPersistence();

export const useSocialLoginCallback = () => {
    const { close } = globalThis;
    const [loginAction] = useMutation(SOCIAL_LOGIN_ACTION);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = useCallback(async () => {
        try {
            if (isLoading) {
                return;
            }
            setIsLoading(true);

            const params = new URLSearchParams(globalThis.location.search || '');
            const error = params.get('error_message');
            if (error) {
                storage.setItem(
                    LocalStorageKey,
                    JSON.stringify({
                        error
                    })
                );
            } else {
                const login = await loginAction({
                    variables: {
                        state: params.get('state'),
                        code: params.get('code')
                    }
                });
                storage.setItem(
                    LocalStorageKey,
                    JSON.stringify({
                        token: login.data.socialLoginAction
                    })
                );
            }
        } catch (e) {
            storage.setItem(
                LocalStorageKey,
                JSON.stringify({
                    error: e.message
                })
            );
        }
        close && close();
    }, [close, isLoading, loginAction]);

    useEffect(() => {
        handleLogin();
    }, [handleLogin]);

    return {
        handleLogin
    };
};
