import {useMutation} from '@apollo/client';
import {useStripeContext} from '@magebit/pwa-studio-stripe/src/context/stripeContextProvider';
import {CardNumberElement, CardExpiryElement, CardCvcElement} from '@stripe/react-stripe-js';
import React, {useCallback, useEffect, useState} from 'react';
import { AlertCircle as AlertCircleIcon } from 'react-feather';
import {useIntl} from "react-intl";

import {useToasts} from '@magento/peregrine';
import {useCartContext} from '@magento/peregrine/lib/context/cart';
import {CHECKOUT_STEP} from '@magento/peregrine/lib/talons/CheckoutPage/useCheckoutPage';
import Icon from '@magento/venia-ui/lib/components/Icon';

import OPERATIONS from './stripe.gql';

const errorIcon = <Icon src={AlertCircleIcon} size={20} />;

export const useStripe = props => {
    const {
        stripeState,
        setStripeState,
        handlePlaceOrder,
        setCheckoutStep,
        resetReviewOrderButtonClicked,
        isGuestCheckout,
        stripeConfig,
        savedCards
    } = useStripeContext();

    const [savedCardChoice, setSavedCardChoice] = useState('new_card');
    const [saveCard, setSaveCard] = useState(stripeConfig.stripe_save_customer_cards === "1");

    const [{cartId}] = useCartContext();

    const {
        resetShouldSubmit,
        onPaymentSuccess,
        onPaymentError,
        stripe,
        elements
    } = props;

    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();

    const savedCardOptions = [];

    savedCards.forEach(data => {
        savedCardOptions.push({
            key: data.id + ':' + data.brand + ':' + data.last4,
            value: data.id + ':' + data.brand + ':' + data.last4,
            label: formatMessage({
                id: 'stripe.savedCard',
                defaultMessage: '{brand} ending in {last4} (Exp. {month}/{year})'
            }, {
                brand: data.brand.toUpperCase(),
                last4: data.last4,
                month: data.exp_month,
                year: data.exp_year
            })
        })
    })

    savedCardOptions.push({
        key: 'new_card',
        value: 'new_card',
        label: 'New Card'
    });

    useEffect(() => {
        if(savedCardChoice === 'new_card') {
            setStripeState(prevState => ({
                ...prevState,
                cardFieldsComplete: false
            }));
        } else {
            setStripeState(prevState => ({
                ...prevState,
                cardFieldsComplete: true
            }));
        }
    }, [savedCardChoice, setStripeState])

    const process3dSecure = useCallback(async () => {
        let completed = 0;
        const errors = [];

        for(const key in stripeState.paymentIntents) {
            const paymentIntent = stripeState.paymentIntents[key];
            let paymentIntentSuccess = true;

            const retrievedPaymentIntent = await stripe.retrievePaymentIntent(paymentIntent);

            if (retrievedPaymentIntent.paymentIntent.status === "requires_action" || retrievedPaymentIntent.paymentIntent.status === "requires_source_action")
            {
                if (retrievedPaymentIntent.paymentIntent.confirmation_method === "manual") {
                    const handleCartAction = await stripe.handleCardAction(paymentIntent);
                    if (handleCartAction.error) {
                        errors.push(handleCartAction.error.message)
                        paymentIntentSuccess = false;
                    }
                } else {
                    const handleCardPayment = await stripe.handleCardPayment(paymentIntent);
                    if (handleCardPayment.error) {
                        errors.push(handleCardPayment.error.message)
                        paymentIntentSuccess = false;
                    }
                }
            }

            if (paymentIntentSuccess) {
                completed++;
            }
        }

        return completed === stripeState.paymentIntents.length ? true : errors;
    }, [stripe, stripeState.paymentIntents])

    useEffect(() => {
      if (stripeState.secureRequired) {
        process3dSecure().then(data => {
            if(data === true) {
                handlePlaceOrder();
            } else {
                resetReviewOrderButtonClicked();
                setCheckoutStep(CHECKOUT_STEP.PAYMENT);
                onPaymentError();
                addToast({
                    type: 'error',
                    icon: errorIcon,
                    message: data.join(', '),
                    dismissable: true,
                    timeout: 7000
                });
            }
        });
      }
    }, [addToast, handlePlaceOrder, onPaymentError, process3dSecure, resetReviewOrderButtonClicked, setCheckoutStep, stripeState])

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

        if (!stripe || !elements) {
            resetShouldSubmit();
            return;
        }

        const newCard = savedCardChoice === 'new_card';
        let result = null;
        let splitCardNumber = null;


        if (newCard) {

            const cardElement = elements.getElement(CardNumberElement);
            const expiryElement = elements.getElement(CardExpiryElement);
            const cvcElement = elements.getElement(CardCvcElement);

            if (!cardElement || !expiryElement || !cvcElement) {
                resetShouldSubmit();
                return;
            }

            result = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement
            });

            if (result.error) {
                addToast({
                    type: 'error',
                    icon: errorIcon,
                    message: result.error.message,
                    dismissable: true,
                    timeout: 7000
                });
                onPaymentError(result.error.message);
                return;
            }

            setStripeState(prevState => ({
                ...prevState,
                cardBrand: result.paymentMethod.card.brand,
                cardLast4: result.paymentMethod.card.last4
            }));
        } else {
            splitCardNumber = savedCardChoice.split(':');
            setStripeState(prevState => ({
                ...prevState,
                cardBrand: splitCardNumber[1],
                cardLast4: splitCardNumber[2]
            }));
        }

        await updatePaymentMethod({
            variables: {
                cartId,
                ccToken: newCard && result ? result.paymentMethod.id : (splitCardNumber ? splitCardNumber[0] : ''),
                ccSave: newCard ? saveCard : false,
                selectedPlan: '',
                ccSaved: savedCardChoice
            }
        });
    }, [stripe, elements, savedCardChoice, updatePaymentMethod, cartId, saveCard, resetShouldSubmit, setStripeState, onPaymentError]);

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
        stripeState,
        isGuestCheckout,
        stripeConfig,
        savedCardOptions,
        savedCardChoice,
        setSavedCardChoice,
        saveCard,
        setSaveCard
    };
};
