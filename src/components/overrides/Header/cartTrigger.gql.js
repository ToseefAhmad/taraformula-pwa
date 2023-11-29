import { gql } from '@apollo/client';

export const CartTriggerFragment = gql`
    fragment CartTriggerFragment on Cart {
        id
        total_quantity
    }
`;

export const GET_ITEM_COUNT_QUERY = gql`
    query getItemCount($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...CartTriggerFragment
        }
    }
    ${CartTriggerFragment}
`;
