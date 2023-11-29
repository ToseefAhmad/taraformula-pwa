import {useStripeContext} from '@magebit/pwa-studio-stripe/src/context/stripeContextProvider';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import classnames from 'classnames';
import React, {useEffect, useState} from 'react';

import classes from './cardSection.module.css';

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: "#023527",
            fontSize: "16px",
            fontFamily: "sans-serif",
            fontSmoothing: "antialiased",
            "::placeholder": {
                color: "#023527CC",
                fontSize: "14px"
            }
        },
        invalid: {
            color: "#023527",
            ":focus": {
                color: "#023527"
            }
        }
    }
};

const CardSection = () => {
    const {
        setStripeState,
    } = useStripeContext();

    const [cardNumberComplete, setCardNumberComplete] = useState(false);
    const [cardExpiryComplete, setCardExpiryComplete] = useState(false);
    const [cardCvcComplete, setCardCvcComplete] = useState(false);

    const [cardNumberError, setCardNumberError] = useState(null);
    const [cardExpiryError, setCardExpiryError] = useState(null);
    const [cardCvcError, setCardCvcError] = useState(null);

    const cardNumberChanged = (event) => {
        if (event.error) {
            setCardNumberError(event.error.message);
            setCardNumberComplete(false);
        }
        if (event.complete) {
            setCardNumberError(null);
            setCardNumberComplete(true);
        }
    };

    const cardExpiryChanged = (event) => {
        if (event.error) {
            setCardExpiryError(event.error.message);
            setCardExpiryComplete(false);
        }
        if (event.complete) {
            setCardExpiryError(null);
            setCardExpiryComplete(true);
        }
    };

    const cardCvcChanged = (event) => {
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

    const cardNumberErrorOutput = cardNumberError && <div className={classes.cardErrorText}>{cardNumberError}</div>;
    const cardExpiryErrorOutput = cardExpiryError && <div className={classes.cardErrorText}>{cardExpiryError}</div>;
    const cardCvcErrorOutput = cardCvcError && <div className={classes.cardErrorText}>{cardCvcError}</div>;

    return (
        <div className={classes.root}>
            <div className={classes.cardNumberContainer}>
                <div className={classnames(classes.stripeInput, {
                    [classes.inputError]: !!cardNumberErrorOutput
                })}>
                    <CardNumberElement onChange={cardNumberChanged} options={CARD_ELEMENT_OPTIONS}/>
                </div>
                {cardNumberErrorOutput}
            </div>
            <div className={classes.cardExpiryContainer}>
                <div className={classnames(classes.stripeInput, {
                    [classes.inputError]: !!cardExpiryErrorOutput
                })}>
                    <CardExpiryElement onChange={cardExpiryChanged} options={CARD_ELEMENT_OPTIONS}/>
                </div>
                {cardExpiryErrorOutput}
            </div>
            <div className={classes.cardCvcContainer}>
                <div className={classnames(classes.stripeInput, {
                    [classes.inputError]: !!cardCvcErrorOutput
                })}>
                    <CardCvcElement onChange={cardCvcChanged} options={CARD_ELEMENT_OPTIONS}/>
                </div>
                {cardCvcErrorOutput}
            </div>
        </div>
    );
}

export default CardSection;
