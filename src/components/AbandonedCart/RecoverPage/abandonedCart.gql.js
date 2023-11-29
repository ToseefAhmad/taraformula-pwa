import { gql } from '@apollo/client';

export const RECOVER_ABANDONED_CART = gql`
    mutation RecoverAbandonedCart($token: String) {
        recoverAbandonedCart(token: $token)
    }
`;
