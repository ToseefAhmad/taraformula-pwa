import { STRIPE_3DS_FULL_ERROR } from '@magebit/pwa-studio-stripe/src/components/PlaceOrderErrors';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { node, func, instanceOf, bool } from 'prop-types';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import { useStripeSavedCards } from '@app/talons/Stripe/useStripeSavedCards';
import CheckoutError from '@magento/peregrine/lib/talons/CheckoutPage/CheckoutError';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';

import { useStripeConfig } from './useStripeConfig';

const StripeContext = createContext({});

const StripeContextProvider = ({
    children,
    handlePlaceOrder,
    checkoutError,
    setCheckoutStep,
    resetReviewOrderButtonClicked,
    isGuestCheckout,
    redirectIfDisabled
}) => {
    const { stripeConfig, stripeLoading, showLoadingIndicator } = useStripeConfig();
    const { savedCards, isFetching, billingAddress } = useStripeSavedCards({
        isGuestCheckout
    });

    const [stripeSavedCards, setStripeSavedCards] = useState([]);
    const [nameOnCard, setNameOnCard] = useState({});
    const [stripeState, setStripeState] = useState({
        cardFieldsComplete: false,
        cardBrand: null,
        cardLast4: null,
        secureRequired: false,
        paymentIntents: []
    });

    useEffect(() => {
        if (checkoutError instanceof CheckoutError && checkoutError.is3dSecure()) {
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
    }, [setStripeSavedCards, savedCards]);

    useEffect(() => {
        if (billingAddress) {
            setNameOnCard({
                firstname: billingAddress.firstname,
                lastname: billingAddress.lastname
            });
        }
    }, [setNameOnCard, billingAddress]);

    if (showLoadingIndicator) {
        return fullPageLoadingIndicator;
    }

    if (stripeConfig && stripeConfig.storeConfig.stripe_cc_enabled === '1') {
        const stripePromise = loadStripe(
            stripeConfig.storeConfig.stripe_mode === 'test'
                ? stripeConfig.storeConfig.stripe_public_key_test
                : stripeConfig.storeConfig.stripe_public_key_live
        );

        return (
            <StripeContext.Provider
                value={{
                    stripeState,
                    setStripeState,
                    handlePlaceOrder,
                    checkoutError,
                    setCheckoutStep,
                    resetReviewOrderButtonClicked,
                    stripeConfig: stripeConfig.storeConfig,
                    stripeLoading,
                    isGuestCheckout,
                    savedCards: stripeSavedCards,
                    isFetching,
                    setStripeSavedCards,
                    nameOnCard
                }}
            >
                <Elements stripe={stripePromise}>{children}</Elements>
            </StripeContext.Provider>
        );
    }

    if (redirectIfDisabled) {
        return <Redirect to={'/no-route'} />;
    }

    return children;
};

StripeContextProvider.propTypes = {
    children: node,
    handlePlaceOrder: func,
    checkoutError: instanceOf(CheckoutError),
    setCheckoutStep: func,
    resetReviewOrderButtonClicked: func,
    isGuestCheckout: bool,
    redirectIfDisabled: bool
};

export default StripeContextProvider;
export const useStripeContext = () => useContext(StripeContext);
