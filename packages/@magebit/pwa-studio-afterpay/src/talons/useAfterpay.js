import { useMutation } from '@apollo/client';
import { useCallback, useEffect } from 'react';

import { useAfterpayContext } from '../context/afterpayContextProvider';

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

import { SET_PAYMENT_METHOD_ON_CART } from './afterpay.gql';

const storage = new BrowserPersistence();

export const useAfterpay = props => {
    const { createAfterpayCheckout, afterpayCheckout } = useAfterpayContext();

    const [{ cartId }] = useCartContext();

    const { resetShouldSubmit, onPaymentSuccess, onPaymentError } = props;

    const [
        updatePaymentMethod,
        {
            error: paymentMethodMutationError,
            called: paymentMethodMutationCalled,
            loading: paymentMethodMutationLoading
        }
    ] = useMutation(SET_PAYMENT_METHOD_ON_CART);

    /**
     * This function will be called if it can't set address.
     */
    const onBillingAddressChangedError = useCallback(() => {
        resetShouldSubmit();
    }, [resetShouldSubmit]);

    /**
     * This function will be called if address was successfully set.
     */
    const onBillingAddressChangedSuccess = useCallback(async () => {
        if (!afterpayCheckout) {
            await createAfterpayCheckout();
        } else {
            await updatePaymentMethod({
                variables: {
                    cartId,
                    afterpayToken: afterpayCheckout.createAfterpayCheckout.afterpay_token
                }
            });

            storage.setItem(
                'afterpay_redirectUrl',
                afterpayCheckout.createAfterpayCheckout.afterpay_redirectCheckoutUrl
            );
        }
    }, [afterpayCheckout, createAfterpayCheckout, updatePaymentMethod, cartId]);

    useEffect(() => {
        const paymentMethodMutationCompleted = paymentMethodMutationCalled && !paymentMethodMutationLoading;

        if (paymentMethodMutationCompleted && !paymentMethodMutationError) {
            onPaymentSuccess();
        }

        if (paymentMethodMutationCompleted && paymentMethodMutationError) {
            onPaymentError();
        }
    }, [
        paymentMethodMutationError,
        paymentMethodMutationLoading,
        paymentMethodMutationCalled,
        onPaymentSuccess,
        onPaymentError,
        resetShouldSubmit
    ]);

    return {
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess
    };
};
