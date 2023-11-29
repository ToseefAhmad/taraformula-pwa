import {useEmbedPay} from "@magebit/pwa-studio-myfatoorah/src/talons/useEmbedPay";
import { bool, func } from 'prop-types';
import React, {useEffect, useState} from 'react';
import {FormattedMessage} from "react-intl";

import BillingAddress from '@magento/venia-ui/lib/components/CheckoutPage/BillingAddress';
import LoadingIndicator from "@magento/venia-ui/lib/components/LoadingIndicator";

import classes from './embedPay.module.css';

const EmbedPay = props => {
    const {
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess,
        externalScriptLoaded,
        myFatoorahConfig,
        sessionLoading
    } = useEmbedPay(props);

    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (externalScriptLoaded && myFatoorahConfig.sessionId && !isInitialized) {
            setIsInitialized(true);
            myFatoorah.init(myFatoorahConfig);
            window.addEventListener("message", myFatoorah.recievedMessage, false);
        }
    }, [myFatoorahConfig, externalScriptLoaded, isInitialized, setIsInitialized]);

    if(sessionLoading) {
        return (
            <LoadingIndicator>
                <FormattedMessage
                    id={'checkoutPage.loadingPaymentInformation'}
                    defaultMessage={'Fetching Payment Information'}
                />
            </LoadingIndicator>
        )
    }

    return (
        <div className={classes.root}>
            <div className={classes.cardElement} id="card-element" />
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

EmbedPay.propTypes = {
    shouldSubmit: bool.isRequired,
    onPaymentSuccess: func,
    onPaymentReady: func,
    onPaymentError: func,
    resetShouldSubmit: func.isRequired
};

export default EmbedPay;
