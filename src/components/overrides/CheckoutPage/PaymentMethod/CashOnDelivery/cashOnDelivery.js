import { bool, func, shape, string } from 'prop-types';
import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';
import BillingAddress from '@magento/venia-ui/lib/components/CheckoutPage/BillingAddress';

import defaultClasses from './cashOnDelivery.module.css';
import { useCashOnDelivery } from './useCashOnDelivery';

const CashOnDelivery = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const { paymentInstructions, onBillingAddressChangedError, onBillingAddressChangedSuccess } = useCashOnDelivery(
        props
    );
    return (
        <div>
            {paymentInstructions && <p className={classes.instructions}>{paymentInstructions}</p>}
            <BillingAddress
                resetShouldSubmit={props.resetShouldSubmit}
                shouldSubmit={props.shouldSubmit}
                onBillingAddressChangedError={onBillingAddressChangedError}
                onBillingAddressChangedSuccess={onBillingAddressChangedSuccess}
            />
        </div>
    );
};

CashOnDelivery.propTypes = {
    classes: shape({ root: string }),
    shouldSubmit: bool.isRequired,
    resetShouldSubmit: func.isRequired
};

export default CashOnDelivery;
