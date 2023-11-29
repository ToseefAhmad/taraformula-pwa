import {usePaymentValidation} from "@magebit/pwa-studio-myfatoorah/src/talons/usePaymentValidation";
import React, {useEffect} from 'react';
import {FormattedMessage} from "react-intl";


import LoadingIndicator from "@magento/venia-ui/lib/components/LoadingIndicator";


const Redirect = ({data, placeOrderData}) => {

    const {
        fetchRedirectUrl
    } = usePaymentValidation();

    useEffect(() => {
        fetchRedirectUrl(data, placeOrderData);
    }, [data, fetchRedirectUrl, placeOrderData])

    return (
        <LoadingIndicator>
            <FormattedMessage
                id={'checkoutPage.redirecting'}
                defaultMessage={'Redirecting...'}
            />
        </LoadingIndicator>
    )
};

export default Redirect;
