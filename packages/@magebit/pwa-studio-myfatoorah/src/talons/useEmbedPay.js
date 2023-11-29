import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useEffect } from 'react';
import { useIntl } from "react-intl";

import { useMyFatoorahContext } from "../context/myFatoorahContextProvider";

import { useToasts } from "@magento/peregrine";
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { BrowserPersistence } from "@magento/peregrine/lib/util";

import OPERATIONS from './myFatoorah.gql';


const storage = new BrowserPersistence();

export const useEmbedPay = props => {
    const {
        myFatoorahState,
        setMyFatoorahState,
        myFatoorahConfig,
        setMyFatoorahConfig
    } = useMyFatoorahContext();

    const [{cartId}] = useCartContext();
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();

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
    ] = useMutation(OPERATIONS.setPaymentMethodOnCartMutation);

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

        let response = {
            SessionId: null,
            CardBrand: null
        };

        try {
            response = await myFatoorah.submit()
        } catch (err) {
            console.log(response);
            onPaymentError(err);
            const cartDetailMessage = "Card details are invalid or missing!";
            if (err === cartDetailMessage) {
                addToast({
                    type: 'error',
                    message: formatMessage({
                        id: 'myFatoorah.cardValidationError',
                        defaultMessage: cartDetailMessage
                    }),
                    dismissable: true,
                    timeout: 7000
                });
            } else {
                addToast({
                    type: 'error',
                    message: err,
                    dismissable: true,
                    timeout: 7000
                });
            }
            resetShouldSubmit();
            return;
        }

        setMyFatoorahState(prevState => ({
            ...prevState,
            cardBrand: response.CardBrand
        }))

        setMyFatoorahConfig(prevState => ({
            ...prevState,
            sessionId: response.SessionId
        }))

        await updatePaymentMethod({
            variables: {
                cartId
            }
        });
    }, [setMyFatoorahState, setMyFatoorahConfig, updatePaymentMethod, cartId, onPaymentError, addToast, resetShouldSubmit]);

    const { data: sessionData, loading: sessionLoading } = useQuery(OPERATIONS.getSessionId, {
        skip: myFatoorahConfig.sessionId,
        fetchPolicy: 'no-cache'
    });

    useEffect(() => {
        if(sessionData) {
            setMyFatoorahConfig(prevState => ({
                ...prevState,
                sessionId: sessionData.getMyFatoorahSessionId.session_id,
                countryCode: sessionData.getMyFatoorahSessionId.country,
                isTesting: sessionData.getMyFatoorahSessionId.is_testing
            }));
            storage.removeItem('myfatoorah_gateway');
            storage.setItem('myfatoorah_session_id', sessionData.getMyFatoorahSessionId.session_id);
        }
    }, [sessionData, setMyFatoorahConfig])

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
        externalScriptLoaded: myFatoorahState.externalScriptLoaded,
        myFatoorahConfig,
        sessionLoading
    };
};
