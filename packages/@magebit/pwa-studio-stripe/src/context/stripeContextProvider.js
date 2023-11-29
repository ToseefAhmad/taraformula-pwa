import { STRIPE_3DS_FULL_ERROR } from '@magebit/pwa-studio-stripe/src/components/PlaceOrderErrors';
import {useStripeConfig} from '@magebit/pwa-studio-stripe/src/talons/useStripeConfig';
import {useStripeSavedCards} from "@magebit/pwa-studio-stripe/src/talons/useStripeSavedCards";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import {node, func, instanceOf, bool} from "prop-types";
import React, {createContext, useContext, useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';

import CheckoutError from '@magento/peregrine/lib/talons/CheckoutPage/CheckoutError';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import classes from './context.module.css'

const StripeContext = createContext({});

const StripeContextProvider = ({children, handlePlaceOrder, checkoutError, setCheckoutStep, resetReviewOrderButtonClicked, isGuestCheckout, disabledMessage}) => {
    const { stripeConfig } = useStripeConfig();
    const { savedCards } = useStripeSavedCards({
        isGuestCheckout
    });
    const [stripeSavedCards, setStripeSavedCards] = useState([]);
    const [stripeState, setStripeState] = useState({
        cardFieldsComplete: false,
        cardBrand: null,
        cardLast4: null,
        secureRequired: false,
        paymentIntents: []
    });

    useEffect(() => {
        if (
            checkoutError instanceof CheckoutError &&
            checkoutError.is3dSecure()
        ) {
            setStripeState(prevState => ({
                ...prevState,
                secureRequired: true,
                paymentIntents: checkoutError.message.substring(STRIPE_3DS_FULL_ERROR.length).split(',')
            }));
        }
    }, [checkoutError]);

    useEffect(() => {
        if (savedCards) {
            setStripeSavedCards(savedCards.savedCards);
        }
    }, [setStripeSavedCards, savedCards])

    if (!stripeConfig || (!savedCards && !isGuestCheckout)) {
        return (
            <div className={classes.loader}>
                <h4>
                    <FormattedMessage
                        id={'checkoutPage.paymentInformationStep'}
                        defaultMessage={'3. Payment Information'}
                    />
                </h4>
                <LoadingIndicator>
                    <FormattedMessage
                        id={'checkoutPage.loadingPaymentInformation'}
                        defaultMessage={'Fetching Payment Information'}
                    />
                </LoadingIndicator>
            </div>
        );
    }


    if(stripeConfig.storeConfig.stripe_cc_enabled === "1") {
        const stripePromise = loadStripe(stripeConfig.storeConfig.stripe_mode === "test" ? stripeConfig.storeConfig.stripe_public_key_test : stripeConfig.storeConfig.stripe_public_key_live);
        return (
            <StripeContext.Provider value={{
                stripeState,
                setStripeState,
                handlePlaceOrder,
                checkoutError,
                setCheckoutStep,
                resetReviewOrderButtonClicked,
                stripeConfig: stripeConfig.storeConfig,
                isGuestCheckout,
                savedCards: stripeSavedCards,
                setStripeSavedCards
            }}>
                <Elements stripe={stripePromise}>
                    {children}
                </Elements>
            </StripeContext.Provider>
        );
    }

    if(disabledMessage) {
        return (
            <div>{disabledMessage}</div>
        )
    }

    return (
        <div>{children}</div>
    )
};

StripeContextProvider.propTypes = {
    children: node,
    handlePlaceOrder: func,
    checkoutError: instanceOf(CheckoutError),
    setCheckoutStep: func,
    resetReviewOrderButtonClicked: func,
    isGuestCheckout: bool
}

export default StripeContextProvider;
export const useStripeContext = () => useContext(StripeContext);

