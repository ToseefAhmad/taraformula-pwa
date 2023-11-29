import { gql } from '@apollo/client';

export const STARTED_CHECKOUT_EVENT = gql`
    mutation StartedCheckoutEvent($cartId: String, $email: String) {
        startedCheckoutEvent(cartId: $cartId, email: $email)
    }
`;
