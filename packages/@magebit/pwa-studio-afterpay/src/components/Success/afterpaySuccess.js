import React from 'react';
import { Redirect } from 'react-router-dom';

import OrderConfirmationPage from '@app/components/overrides/CheckoutPage/OrderConfirmationPage';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

const storage = new BrowserPersistence();

const AfterpaySuccess = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const failed = queryParams.get('success') !== 'true';
    const orderId = queryParams.get('orderId');
    const cartData = storage.getItem('checkout_order_data');
    storage.removeItem('afterpay_redirectUrl');

    if (cartData) {
        return <OrderConfirmationPage data={cartData} orderNumber={orderId} failed={failed} />;
    }

    return <Redirect to={'/404.html'} />;
};

export default AfterpaySuccess;
