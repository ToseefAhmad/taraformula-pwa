import { useMutation } from '@apollo/client';
import { useFieldState } from 'informed';
import { useState } from 'react';

import { useCartContext } from '@magento/peregrine/lib//context/cart';

import { STARTED_CHECKOUT_EVENT } from './startedCheckout.gql';

const StartedGuestCheckout = () => {
    const emailFieldState = useFieldState('email');
    const { value: email } = emailFieldState;
    const pattern = /[a-zA-Z0-9]+[.]?([a-zA-Z0-9]+)?[@][a-z]{3,9}[.][a-z]{2,5}/g;
    const isValid = pattern.test(email);
    const [{ cartId }] = useCartContext();
    const [startedCheckoutEvent] = useMutation(STARTED_CHECKOUT_EVENT);
    const [oldEmail, setOldEmail] = useState(null);

    if (!isValid || email === oldEmail) {
        return null;
    }

    setOldEmail(email);

    startedCheckoutEvent({
        variables: {
            cartId: cartId,
            email: email
        }
    });

    return null;
};

export default StartedGuestCheckout;
