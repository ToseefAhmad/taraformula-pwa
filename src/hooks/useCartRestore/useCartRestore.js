import { useApolloClient, useMutation } from '@apollo/client';
import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router';

import { useAppContext } from '@app/context/App';
import { saveCartId } from '@app/overrides/peregrine/store/actions/cart/asyncActions';
import { clearCartDataFromCache } from '@magento/peregrine/lib/Apollo/clearCartDataFromCache';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import BrowserPersistence from '@magento/peregrine/lib/util/simplePersistence';

import { GET_CART_DETAILS_AFTER_RESTORE, RESTORE_CART_ON_FAILED_PAYMENT } from './useCartRestore.gql';

const storage = new BrowserPersistence();

const useCartRestore = () => {
    const [restoreCart] = useMutation(RESTORE_CART_ON_FAILED_PAYMENT);
    const fetchCartDetails = useAwaitQuery(GET_CART_DETAILS_AFTER_RESTORE);
    const [, { removeCart, getCartDetails, setCartIdToState }] = useCartContext();
    const [, { setIsRestoringCart }] = useAppContext();
    const apolloClient = useApolloClient();
    const { pathname } = useLocation();

    const handleRestoringCart = useCallback(
        async orderNumber => {
            const result = await restoreCart({
                variables: {
                    orderNumber
                }
            });

            if (result && result.data && result.data.restoreQuoteFromOrder) {
                await removeCart();
                await clearCartDataFromCache(apolloClient);
                await saveCartId(result.data.restoreQuoteFromOrder.id);
                await setCartIdToState(result.data.restoreQuoteFromOrder.id);
                await getCartDetails({ fetchCartDetails });
            }
            setIsRestoringCart(false);
        },
        [restoreCart, removeCart, apolloClient, getCartDetails, fetchCartDetails, setIsRestoringCart, setCartIdToState]
    );

    useEffect(() => {
        try {
            const queryParams = new URLSearchParams(window.location.search);
            const successValue = queryParams.get('success') || 'true';
            const failed = successValue !== 'true';
            const orderNumber = storage.getItem('checkout_order_number');

            // We need to allow the version with trailing slash as well, otherwise the customer will be redirected to homepage
            const allowedPaths = [
                '/checkout/success',
                '/checkout/success/',
                '/checkout-tabby/success',
                '/checkout-tabby/success/',
                '/checkout/afterpay',
                '/checkout/afterpay/'
            ];

            // If the payment method doesn't have a specific success/failure page, but uses a param, restore the cart on fail.
            if (failed && orderNumber && typeof orderNumber !== 'object') {
                // Restore Previous quote if we have not been in order success page already.
                setIsRestoringCart(true);
                handleRestoringCart(orderNumber);
            }

            if (!allowedPaths.includes(pathname) && orderNumber) {
                if (typeof orderNumber !== 'object') {
                    // Restore Previous quote if we have not been in order success page already.
                    setIsRestoringCart(true);
                    handleRestoringCart(orderNumber);
                }
                storage.removeItem('checkout_order_data');
                storage.removeItem('checkout_order_number');
            }
        } catch (e) {
            // Do nothing and ignore
        }
    }, [handleRestoringCart, pathname, setIsRestoringCart]);
};

export default useCartRestore;
