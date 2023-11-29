import { bool, func, instanceOf, node, object } from 'prop-types';
import React, { createContext, useContext } from 'react';

import { useAfterpayCheckout } from '../talons/useAfterpayCheckout';

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import CheckoutError from '@magento/peregrine/lib/talons/CheckoutPage/CheckoutError';

const AfterpayContext = createContext({});
const AfterpayContextProvider = ({
    children,
    handlePlaceOrder,
    checkoutError,
    setCheckoutStep,
    resetReviewOrderButtonClicked,
    isGuestCheckout
}) => {
    const [{ cartId }] = useCartContext();
    const { createAfterpayCheckout, afterpayCheckout } = useAfterpayCheckout({ cartId });

    return (
        <AfterpayContext.Provider
            value={{
                handlePlaceOrder,
                checkoutError,
                setCheckoutStep,
                resetReviewOrderButtonClicked,
                isGuestCheckout,
                createAfterpayCheckout,
                afterpayCheckout
            }}
        >
            {children}
        </AfterpayContext.Provider>
    );
};

AfterpayContextProvider.propTypes = {
    children: node,
    handlePlaceOrder: func,
    checkoutError: instanceOf(CheckoutError),
    setCheckoutStep: func,
    resetReviewOrderButtonClicked: func,
    isGuestCheckout: bool,
    createAfterpayCheckout: func,
    afterpayCheckout: object
};

export default AfterpayContextProvider;
export const useAfterpayContext = () => useContext(AfterpayContext);
