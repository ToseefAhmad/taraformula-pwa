import { gql } from '@apollo/client';

export const COPY_CART = gql`
    mutation CopyCart($cartId: String!) {
        copyCart(input: { cart_id_from: $cartId })
    }
`;

export const RELEASE_ONE_TIME_TOKEN = gql`
    mutation ReleaseOneTimeToken($token: String!) {
        releaseOneTimeToken(token: $token)
    }
`;
