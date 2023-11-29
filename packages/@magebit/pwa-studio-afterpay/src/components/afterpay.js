import { bool, func } from 'prop-types';
import React from 'react';

import { useAfterpay } from '../talons/useAfterpay';

import BillingAddress from '@magento/venia-ui/lib/components/CheckoutPage/BillingAddress';

const Afterpay = props => {
    const { onBillingAddressChangedError, onBillingAddressChangedSuccess } = useAfterpay(props);

    return (
        <div>
            <BillingAddress
                resetShouldSubmit={props.resetShouldSubmit}
                shouldSubmit={props.shouldSubmit}
                onBillingAddressChangedError={onBillingAddressChangedError}
                onBillingAddressChangedSuccess={onBillingAddressChangedSuccess}
            />
        </div>
    );
};

Afterpay.propTypes = {
    shouldSubmit: bool.isRequired,
    onPaymentSuccess: func,
    onPaymentReady: func,
    onPaymentError: func,
    resetShouldSubmit: func.isRequired
};

export default Afterpay;
