import React from 'react';
import { Redirect, useParams } from 'react-router-dom';

import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import { useRecoverCart } from './useRecoverCart';

const RecoverCart = () => {
    const { token } = useParams();
    const { isBusy } = useRecoverCart();

    if (!token) {
        return <Redirect to="/cart" />;
    }

    if (isBusy) {
        return <LoadingIndicator />;
    }

    return <Redirect to="/cart" />;
};

export default RecoverCart;
