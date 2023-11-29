import {useMutation} from '@apollo/client';
import {useCallback, useEffect} from 'react';
import {useCartContext} from '@magento/peregrine/lib/context/cart';

import OPERATIONS from './myFatoorah.gql';
import {useGatewayContext} from "../context/gatewayContextProvider";
import {usePaymentMethods} from "@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/usePaymentMethods";
import {BrowserPersistence} from "@magento/peregrine/lib/util";

const storage = new BrowserPersistence();

export const useGateway = props => {
    const {
        setMyFatoorahState,
    } = useGatewayContext();
    const [{cartId}] = useCartContext();

    const {
        availablePaymentMethods,
        currentSelectedPaymentMethod
    } = usePaymentMethods({});

    const gatewayName = availablePaymentMethods.find(data => data.code === currentSelectedPaymentMethod).title;

    const {
        resetShouldSubmit,
        onPaymentSuccess,
        onPaymentError
    } = props;

    const [
        updatePaymentMethod,
        {
            error: paymentMethodMutationError,
            called: paymentMethodMutationCalled,
            loading: paymentMethodMutationLoading
        }
    ] = useMutation(OPERATIONS.setGatewayCartMutation);

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

        setMyFatoorahState(prevState => ({
            ...prevState,
            selectedGateway: currentSelectedPaymentMethod.replace('myfatoorah_gateway_', ''),
            gatewayName
        }))

        storage.setItem('myfatoorah_gateway', currentSelectedPaymentMethod.replace('myfatoorah_gateway_', ''))
        storage.removeItem('myfatoorah_session_id')


        await updatePaymentMethod({
            variables: {
                cartId
            }
        });
    }, [updatePaymentMethod, cartId, setMyFatoorahState, currentSelectedPaymentMethod, gatewayName]);

    useEffect(() => {
        const paymentMethodMutationCompleted =
            paymentMethodMutationCalled && !paymentMethodMutationLoading;

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
        onBillingAddressChangedSuccess,
        gatewayName
    };
};
