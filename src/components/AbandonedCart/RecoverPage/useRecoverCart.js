import { useApolloClient, useMutation } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';

import { ToastType, useToasts } from '@app/hooks/useToasts';
import store from '@app/store';
import { clearCartDataFromCache } from '@magento/peregrine/lib/Apollo/clearCartDataFromCache';
import { clearCustomerDataFromCache } from '@magento/peregrine/lib/Apollo/clearCustomerDataFromCache';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import actions from '@magento/peregrine/lib/store/actions/cart/actions';
import { saveCartId } from '@magento/peregrine/lib/store/actions/cart/asyncActions';
import SIGNIN_OPERATIONS from '@magento/peregrine/lib/talons/SignIn/signIn.gql.js';
import { GET_CART_DETAILS_QUERY } from '@magento/venia-ui/lib/components/SignIn/signIn.gql.js';

import { RECOVER_ABANDONED_CART } from './abandonedCart.gql';

export const useRecoverCart = () => {
    const { token } = useParams();
    const [recoverAbandonedCartAction] = useMutation(RECOVER_ABANDONED_CART);
    const [, { addToast }] = useToasts();
    const [isLoading, setIsLoading] = useState(false);
    const { createCartMutation } = SIGNIN_OPERATIONS;
    const [, { createCart, removeCart, getCartDetails }] = useCartContext();
    const apolloClient = useApolloClient();
    const { formatMessage } = useIntl();
    const [{ isGettingDetails }, { getUserDetails }] = useUserContext();

    const [fetchCartId] = useMutation(createCartMutation);
    const fetchUserDetails = useAwaitQuery(SIGNIN_OPERATIONS.getCustomerQuery);
    const fetchCartDetails = useAwaitQuery(GET_CART_DETAILS_QUERY);

    const setCartId = useCallback(async cartId => {
        await saveCartId(cartId);
        await store.dispatch(actions.getCart.receive(cartId));
    }, []);

    const abandonedCartAction = useCallback(async () => {
        setIsLoading(true);

        try {
            const recoverAbandonedCart = await recoverAbandonedCartAction({
                variables: {
                    token: token
                }
            });

            await clearCartDataFromCache(apolloClient);
            await clearCustomerDataFromCache(apolloClient);
            await removeCart();

            await createCart({
                fetchCartId
            });

            const sourceCartId = recoverAbandonedCart.data.recoverAbandonedCart;
            await setCartId(sourceCartId);

            getUserDetails({ fetchUserDetails });
            getCartDetails({ fetchCartId, fetchCartDetails });

            addToast({
                type: ToastType.SUCCESS,
                message: formatMessage({
                    id: 'recoverCart.cartRecovered',
                    defaultMessage: 'Your cart has been recovered!'
                })
            });

            setIsLoading(false);
        } catch (e) {
            addToast({
                type: ToastType.ERROR,
                message: e.message
            });

            setIsLoading(false);
        }
    }, [
        recoverAbandonedCartAction,
        token,
        apolloClient,
        removeCart,
        createCart,
        fetchCartId,
        setCartId,
        getUserDetails,
        fetchUserDetails,
        getCartDetails,
        fetchCartDetails,
        addToast,
        formatMessage
    ]);

    useEffect(() => {
        abandonedCartAction();
    }, [abandonedCartAction]);

    return {
        isBusy: isGettingDetails || isLoading
    };
};
