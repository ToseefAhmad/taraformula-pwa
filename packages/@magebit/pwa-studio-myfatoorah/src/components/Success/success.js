import {usePaymentValidation} from "@magebit/pwa-studio-myfatoorah/src/talons/usePaymentValidation";
import React, {useEffect} from 'react';
import {FormattedMessage} from "react-intl";
import {useHistory} from "react-router-dom";

import OrderConfirmationPage from "@app/components/overrides/CheckoutPage/OrderConfirmationPage";
import LoadingIndicator from "@magento/venia-ui/lib/components/LoadingIndicator";

const Success = () => {

    const {
        fetchPaymentValidation,
        isLoading,
        cartData,
        placeOrderData,
        validationSubmitted,
        isSuccess,
        orderNumber
    } = usePaymentValidation();

    const history = useHistory();

    const queryParams = new URLSearchParams(window.location.search);
    const paymentId = queryParams.get('paymentId')

    useEffect(() => {
        if (!paymentId || !cartData || !placeOrderData) {
           history.push('/');
        }
        if (!validationSubmitted) {
            fetchPaymentValidation(paymentId);
        }
    }, [cartData, fetchPaymentValidation, history, paymentId, placeOrderData, validationSubmitted]);

    if (isLoading) {
        return (
            <LoadingIndicator>
                <FormattedMessage
                    id={'checkoutSuccess.validating'}
                    defaultMessage={'Validating Payment'}
                />
            </LoadingIndicator>
        )
    } else if(!isLoading && cartData && orderNumber) {
        return <OrderConfirmationPage data={cartData} orderNumber={orderNumber} failed={!isSuccess}/>;
    } else {
        return null;
    }
};

export default Success;
