import { useStripe } from '@magebit/pwa-studio-stripe/src/talons/useStripe';
import { ElementsConsumer } from '@stripe/react-stripe-js';
import { bool, func } from 'prop-types';
import React from 'react';
import {useIntl} from 'react-intl';

import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import BillingAddress from '@magento/venia-ui/lib/components/CheckoutPage/BillingAddress';
import RadioGroup from "@magento/venia-ui/lib/components/RadioGroup";

import CardSection from './cardSection';
import classes from './stripe.module.css';

const Stripe = props => {
    const {
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess,
        stripeState,
        isGuestCheckout,
        stripeConfig,
        savedCardChoice,
        setSavedCardChoice,
        savedCardOptions,
        saveCard,
        setSaveCard
    } = useStripe(props);

    const { formatMessage } = useIntl();

    const savedCards = !isGuestCheckout && (
        <RadioGroup
            onValueChange={setSavedCardChoice}
            field="radio"
            id="radio"
            initialValue={savedCardChoice}
            items={savedCardOptions}
        />
    );

    const saveCardCheckbox = !isGuestCheckout && ["1", "3"].includes(stripeConfig.stripe_save_customer_cards) && (
        <div className={classes.save_card}>
            <Checkbox
                onValueChange={setSaveCard}
                field="saveCard"
                label={formatMessage({
                    id: 'stripe.saveCreditCard',
                    defaultMessage:
                        'Save card for future purchases'
                })}
                initialValue={saveCard}
            />
        </div>
    );

    return (
        <div className={classes.root}>
            {savedCards}
            {savedCardChoice === 'new_card' && <CardSection />}
            {savedCardChoice === 'new_card' && saveCardCheckbox}
            <div className={classes.billingAddressCheckbox}>
                <BillingAddress
                    resetShouldSubmit={props.resetShouldSubmit}
                    shouldSubmit={props.shouldSubmit}
                    onBillingAddressChangedError={onBillingAddressChangedError}
                    onBillingAddressChangedSuccess={onBillingAddressChangedSuccess}
                />
            </div>
        </div>
    );
}

Stripe.propTypes = {
    shouldSubmit: bool.isRequired,
    onPaymentSuccess: func,
    onPaymentReady: func,
    onPaymentError: func,
    resetShouldSubmit: func.isRequired
};

const InjectedCheckoutForm = props => {
    return (
        <ElementsConsumer>
            {({ stripe, elements }) => (
                <Stripe stripe={stripe} elements={elements} {...props} />
            )}
        </ElementsConsumer>
    );
}

export default InjectedCheckoutForm;
