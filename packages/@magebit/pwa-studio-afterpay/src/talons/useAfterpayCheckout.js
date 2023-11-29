import { useMutation } from '@apollo/client';
import { useCallback } from 'react';

import { CREATE_AFTERPAY_CHECKOUT } from './afterpay.gql';

export const useAfterpayCheckout = ({ cartId }) => {
    const [afterpayCheckoutMutation, { data, error, loading }] = useMutation(CREATE_AFTERPAY_CHECKOUT, {
        variables: { cartId },
        errorPolicy: 'all'
    });

    const createAfterpayCheckout = useCallback(async () => {
        await afterpayCheckoutMutation(cartId);
    }, [afterpayCheckoutMutation, cartId]);

    return {
        createAfterpayCheckout,
        afterpayCheckout: data,
        afterpayError: error,
        afterpayLoading: loading
    };
};
