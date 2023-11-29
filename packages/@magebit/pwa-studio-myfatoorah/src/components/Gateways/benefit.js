import { useGateway } from "@magebit/pwa-studio-myfatoorah/src/talons/useGateway";
import { bool, func } from 'prop-types';
import React from 'react';

import BillingAddress from '@magento/venia-ui/lib/components/CheckoutPage/BillingAddress';

import classes from './paymentMethod.module.css';
import {FormattedMessage} from "react-intl";

const Benefit = props => {

    const {
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess,
        gatewayName
    } = useGateway(props);

    return (
        <div className={classes.root}>
            <div>
                <FormattedMessage
                    id={'myFatoorah.redirectMessage'}
                    values={{
                        gateway: gatewayName
                    }}
                    defaultMessage={'After clicking "Place the Order", you will be redirected to {gateway} to complete your purchase securely.'}
                />
            </div>
            <div className={classes.billingAddressCheckbox}>
                <BillingAddress
                    resetShouldSubmit={props.resetShouldSubmit}
                    shouldSubmit={props.shouldSubmit}
                    onBillingAddressChangedError={onBillingAddressChangedError}
                    onBillingAddressChangedSuccess={onBillingAddressChangedSuccess}
                />
            </div>
        </div>
    )
}

Benefit.propTypes = {
    shouldSubmit: bool.isRequired,
    onPaymentSuccess: func,
    onPaymentReady: func,
    onPaymentError: func,
    resetShouldSubmit: func.isRequired
};

export default Benefit;
