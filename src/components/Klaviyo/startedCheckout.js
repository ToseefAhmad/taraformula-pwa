import { useMutation } from '@apollo/client';
import { useState } from 'react';

import { useCartContext } from '@magento/peregrine/lib//context/cart';
import { useUserContext } from '@magento/peregrine/lib//context/user';

import { STARTED_CHECKOUT_EVENT } from './startedCheckout.gql';

const StartedCheckout = () => {
    const [{ cartId }] = useCartContext();
    const [{ isSignedIn }] = useUserContext();
    const [eventTriggered, setEventTriggered] = useState(false);
    const [startedCheckoutEvent] = useMutation(STARTED_CHECKOUT_EVENT);

    if (!isSignedIn || eventTriggered) {
        return null;
    }

    setEventTriggered(true);

    startedCheckoutEvent({
        variables: {
            cartId: cartId
        }
    });

    return null;
};

export default StartedCheckout;
