import { useMutation } from '@apollo/client';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { URL_KEYS } from '@app/components/StorageUpdateFromUrl';
import { useRedirectContext } from '@app/context/RedirectContext/useRedirectContext';
import { setToken } from '@app/overrides/peregrine/store/actions/user/asyncActions';
import store from '@app/store';
import actions from '@magento/peregrine/lib/store/actions/cart/actions';
import { saveCartId } from '@magento/peregrine/lib/store/actions/cart/asyncActions';

import { COPY_CART, RELEASE_ONE_TIME_TOKEN } from './storageUpdateFromUrl.gql';

/**
 * This hook is used to set necessary data provided in url params before page is loaded.
 *
 * @returns {{loading: boolean}}
 */
const useStorageUpdateFromUrl = () => {
    const { isRedirectCompleted } = useRedirectContext();

    const urlParams = useMemo(() => new URLSearchParams(globalThis.location.search), []);
    const [urlSigninToken, setUrlSigninToken] = useState(urlParams.get(URL_KEYS.signinToken));
    const [urlCartId, setUrlCartId] = useState(urlParams.get(URL_KEYS.cartId));

    const [loading, setLoading] = useState(true);
    const [loadingSigninToken, setLoadingSigninToken] = useState(false);
    const [loadingCartId, setLoadingCartId] = useState(false);

    const [copyCart] = useMutation(COPY_CART);
    const [ReleaseOneTimeToken] = useMutation(RELEASE_ONE_TIME_TOKEN);

    const deleteParamAndUpdateUrl = useCallback(
        param => {
            urlParams.delete(param);
            window.history.replaceState(
                null,
                '',
                globalThis.location.pathname + (urlParams.toString() ? '?' + urlParams : '')
            );
        },
        [urlParams]
    );

    const setSigninToken = useCallback(async token => {
        await store.dispatch(setToken(token));
    }, []);

    const updateSigninToken = useCallback(
        async oneTimeToken => {
            try {
                const {
                    data: { releaseOneTimeToken: singinToken },
                    error
                } = await ReleaseOneTimeToken({
                    fetchPolicy: 'no-cache',
                    variables: {
                        token: oneTimeToken
                    }
                });

                if (singinToken && !error) {
                    await setSigninToken(singinToken);
                }
            } catch (e) {
                console.error('Error during updating user token: ' + e.message);
            }
        },
        [ReleaseOneTimeToken, setSigninToken]
    );

    const setCartId = useCallback(async cartId => {
        await saveCartId(cartId);
        await store.dispatch(actions.getCart.receive(cartId));
    }, []);

    const updateCartId = useCallback(
        async cartId => {
            try {
                const {
                    data: { copyCart: copyCartId },
                    error
                } = await copyCart({
                    fetchPolicy: 'no-cache',
                    variables: {
                        cartId: cartId
                    }
                });

                if (copyCartId && !error) {
                    await setCartId(copyCartId);
                }
            } catch (e) {
                console.error('Error during copying cart: ' + e.message);
            }
        },
        [copyCart, setCartId]
    );

    const handleUrlParams = useCallback(async () => {
        if (loadingSigninToken || loadingCartId) {
            return;
        }

        if (urlSigninToken) {
            setLoadingSigninToken(true);
            await updateSigninToken(urlSigninToken);
            deleteParamAndUpdateUrl(URL_KEYS.signinToken);
            setUrlSigninToken(null);
            setLoadingSigninToken(false);
        } else if (urlCartId) {
            setLoadingCartId(true);
            await updateCartId(urlCartId);
            deleteParamAndUpdateUrl(URL_KEYS.cartId);
            setUrlCartId(null);
            setLoadingCartId(false);
        }
    }, [
        deleteParamAndUpdateUrl,
        loadingCartId,
        loadingSigninToken,
        updateCartId,
        updateSigninToken,
        urlCartId,
        urlSigninToken
    ]);

    useEffect(() => {
        if (!urlSigninToken && !urlCartId) {
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [urlSigninToken, urlCartId]);

    useEffect(() => {
        if (isRedirectCompleted) {
            handleUrlParams();
        }
    }, [handleUrlParams, isRedirectCompleted]);

    return {
        loading
    };
};

export default useStorageUpdateFromUrl;
