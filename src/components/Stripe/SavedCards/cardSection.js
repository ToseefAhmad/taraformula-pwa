import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { useStripeContext } from '@app/talons/Stripe/stripeContextProvider';

import classes from './cardSection.module.css';

const CARD_ELEMENT_STYLES = {
    base: {
        color: '#023527',
        fontSize: '15px',
        fontWeight: '700',
        fontFamily: 'sans-serif',
        fontSmoothing: 'antialiased',
        '::placeholder': {
            color: '#023527',
            fontWeight: '400'
        }
    },
    invalid: {
        color: '#023527'
    }
};

const CardSection = () => {
    const { setStripeState } = useStripeContext();
    const { formatMessage } = useIntl();

    const [cardNumberComplete, setCardNumberComplete] = useState(false);
    const [cardExpiryComplete, setCardExpiryComplete] = useState(false);
    const [cardCvcComplete, setCardCvcComplete] = useState(false);

    const [cardNumberError, setCardNumberError] = useState(null);
    const [cardExpiryError, setCardExpiryError] = useState(null);
    const [cardCvcError, setCardCvcError] = useState(null);

    const NUMBER_ELEMENT_OPTIONS = {
        style: CARD_ELEMENT_STYLES,
        placeholder: formatMessage({
            id: 'cardSection.cardNumberLabel',
            defaultMessage: 'Card Number*'
        })
    };

    const EXPIRY_ELEMENT_OPTIONS = {
        style: CARD_ELEMENT_STYLES
    };

    const CVC_ELEMENT_OPTIONS = {
        style: CARD_ELEMENT_STYLES
    };

    const cardNumberChanged = event => {
        if (event.error) {
            setCardNumberError(event.error.message);
            setCardNumberComplete(false);
        }
        if (event.complete) {
            setCardNumberError(null);
            setCardNumberComplete(true);
        }
    };

    const cardExpiryChanged = event => {
        if (event.error) {
            setCardExpiryError(event.error.message);
            setCardExpiryComplete(false);
        }
        if (event.complete) {
            setCardExpiryError(null);
            setCardExpiryComplete(true);
        }
    };

    const cardCvcChanged = event => {
        if (event.error) {
            setCardCvcError(event.error.message);
            setCardCvcComplete(false);
        }
        if (event.complete) {
            setCardCvcError(null);
            setCardCvcComplete(true);
        }
    };

    useEffect(() => {
        if (cardNumberComplete && cardExpiryComplete && cardCvcComplete) {
            setStripeState(prevState => ({
                ...prevState,
                cardFieldsComplete: true
            }));
        } else {
            setStripeState(prevState => ({
                ...prevState,
                cardFieldsComplete: false
            }));
        }
    }, [cardNumberComplete, cardExpiryComplete, cardCvcComplete, setStripeState]);

    const cardNumberErrorOutput = cardNumberError && <p className={classes.errorMessage}>{cardNumberError}</p>;

    const cardExpiryErrorOutput = cardExpiryError && <p className={classes.errorMessage}>{cardExpiryError}</p>;

    const cardCvcErrorOutput = cardCvcError && <p className={classes.errorMessage}>{cardCvcError}</p>;

    return (
        <div className={classes.root}>
            <div className={classes.cardNumberContainer}>
                <div className={cardNumberError ? classes.cardNumberFieldError : classes.cardNumberField}>
                    <CardNumberElement onChange={cardNumberChanged} options={NUMBER_ELEMENT_OPTIONS} />
                </div>
                {cardNumberErrorOutput}
            </div>
            <div className={classes.cardExpiryContainer}>
                <div className={cardExpiryError ? classes.cardExpiryFieldError : classes.cardExpiryField}>
                    <CardExpiryElement onChange={cardExpiryChanged} options={EXPIRY_ELEMENT_OPTIONS} />
                </div>
                {cardExpiryErrorOutput}
            </div>
            <div className={classes.cardCvcContainer}>
                <div className={cardCvcError ? classes.cardCvcFieldError : classes.cardCvcField}>
                    <CardCvcElement onChange={cardCvcChanged} options={CVC_ELEMENT_OPTIONS} />
                </div>
                {cardCvcErrorOutput}
            </div>
        </div>
    );
};

export default CardSection;
